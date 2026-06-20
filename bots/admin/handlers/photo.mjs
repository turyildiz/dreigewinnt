import { InlineKeyboard } from "grammy";
import { supabase } from "../lib/supabase.mjs";
import { uploadImage } from "../lib/r2.mjs";
import { extractEventFromImage } from "../lib/vision.mjs";

const pendingEvents = new Map();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const townLabels = {
  raunheim: "Raunheim",
  kelsterbach: "Kelsterbach",
  ruesselsheim: "Rüsselsheim am Main",
};

export function registerPhotoHandler(bot) {
  bot.on("message:photo", async (ctx) => {
    const statusMsg = await ctx.reply("📸 Poster wird analysiert…");

    try {
      const photos = ctx.message.photo;
      const largest = photos[photos.length - 1];
      const file = await ctx.api.getFile(largest.file_id);
      const url = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      let imageUrl;
      try {
        imageUrl = await uploadImage(buffer, "jpg");
      } catch (e) {
        console.error("[photo] R2 upload failed:", e.message);
        imageUrl = null;
      }

      const event = await extractEventFromImage(buffer);

      const preview = [
        `*Event erkannt:*`,
        ``,
        `📌 *Titel:* ${escMd(event.title ?? "—")}`,
        `📝 ${escMd(event.description ?? "—")}`,
        `📅 ${escMd(event.date_start ?? "—")}${event.date_end ? ` bis ${escMd(event.date_end)}` : ""}`,
        event.time ? `🕐 ${escMd(event.time)}` : null,
        `📍 ${escMd(event.venue ?? "—")}`,
        event.address ? `   ${escMd(event.address)}` : null,
        `🏘 ${escMd(townLabels[event.town] ?? event.town ?? "—")}`,
        event.category ? `🏷 ${escMd(event.category)}` : null,
        event._placeholder ? `\n⚠️ _Platzhalter \\– Claude API\\-Key nicht gesetzt_` : null,
      ]
        .filter(Boolean)
        .join("\n");

      const keyboard = new InlineKeyboard()
        .text("✅ Veröffentlichen", "event_publish")
        .text("❌ Abbrechen", "event_cancel");

      const previewMsg = await ctx.reply(preview, {
        parse_mode: "MarkdownV2",
        reply_markup: keyboard,
      });

      pendingEvents.set(previewMsg.message_id, { event, imageUrl });

      await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id).catch(() => {});
    } catch (err) {
      console.error("[photo] Error:", err);
      await ctx.api.editMessageText(
        ctx.chat.id,
        statusMsg.message_id,
        `❌ Fehler: ${err.message}`
      ).catch(() => {});
    }
  });

  bot.callbackQuery("event_publish", async (ctx) => {
    const msgId = ctx.callbackQuery.message?.message_id;
    const pending = pendingEvents.get(msgId);

    if (!pending) {
      await ctx.answerCallbackQuery({ text: "Event nicht mehr verfügbar." });
      return;
    }

    try {
      const { event, imageUrl } = pending;
      const slug = slugify(event.title ?? "event") + "-" + Date.now().toString(36);

      let dateStart = event.date_start ?? new Date().toISOString().slice(0, 10);
      let dateEnd = event.date_end;
      if (event.time) {
        const times = event.time.split("-").map(t => t.trim());
        if (times[0]) dateStart = `${dateStart.slice(0, 10)}T${times[0].padStart(5, "0")}:00`;
        if (times[1] && dateEnd) dateEnd = `${dateEnd.slice(0, 10)}T${times[1].padStart(5, "0")}:00`;
        else if (times[1]) dateEnd = `${dateStart.slice(0, 10)}T${times[1].padStart(5, "0")}:00`;
      }

      const { error } = await supabase.from("events").insert({
        slug,
        title: event.title ?? "Unbenanntes Event",
        description: event.description,
        date_start: dateStart,
        date_end: dateEnd,
        venue: event.venue,
        address: event.address,
        town: event.town ?? "ruesselsheim",
        category: event.category,
        image_url: imageUrl,
        status: "active",
      });

      if (error) throw error;

      pendingEvents.delete(msgId);

      await ctx.editMessageText(
        `✅ *Event veröffentlicht\\!*\n\n📌 ${escMd(event.title ?? "Event")}\n🔗 dreigewinnt\\.com/events/${escMd(slug)}`,
        { parse_mode: "MarkdownV2" }
      );
      await ctx.answerCallbackQuery({ text: "Veröffentlicht!" });
    } catch (err) {
      console.error("[publish] Error:", err);
      await ctx.answerCallbackQuery({ text: `Fehler: ${err.message}` });
    }
  });

  bot.callbackQuery("event_cancel", async (ctx) => {
    const msgId = ctx.callbackQuery.message?.message_id;
    pendingEvents.delete(msgId);
    await ctx.editMessageText("❌ Abgebrochen.");
    await ctx.answerCallbackQuery({ text: "Abgebrochen" });
  });
}

function escMd(text) {
  if (!text) return "";
  return String(text).replace(/([_*\[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}
