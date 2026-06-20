import { InlineKeyboard } from "grammy";
import { supabase } from "../lib/supabase.mjs";
import { polishArticle } from "../lib/vision.mjs";

const pendingTexts = new Map();

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function registerTextHandler(bot) {
  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text;
    if (!text || text.startsWith("/")) return;

    const keyboard = new InlineKeyboard()
      .text("✅ Ja, Artikel erstellen", "article_yes")
      .text("❌ Nein", "article_no");

    const msg = await ctx.reply(
      "📰 Soll ich daraus einen Nachrichtenartikel erstellen?",
      { reply_markup: keyboard, reply_parameters: { message_id: ctx.message.message_id } }
    );

    pendingTexts.set(msg.message_id, text);
  });

  bot.callbackQuery("article_yes", async (ctx) => {
    const msgId = ctx.callbackQuery.message?.message_id;
    const rawText = pendingTexts.get(msgId);

    if (!rawText) {
      await ctx.answerCallbackQuery({ text: "Text nicht mehr verfügbar." });
      return;
    }

    await ctx.editMessageText("✍️ Artikel wird erstellt…");

    try {
      const polished = await polishArticle(rawText);
      const title = polished.split("\n")[0].replace(/^#+\s*/, "").slice(0, 120);
      const slug = slugify(title) + "-" + Date.now().toString(36);

      const { error } = await supabase.from("articles").insert({
        slug,
        title,
        body: polished,
        excerpt: polished.slice(0, 200),
        status: "draft",
        type: "nachrichten",
      });

      if (error) throw error;

      pendingTexts.delete(msgId);

      await ctx.editMessageText(
        `✅ Artikel als Entwurf gespeichert.\n\n📰 ${title}\n\n→ Im Admin-Panel unter Nachrichten bearbeiten und veröffentlichen.`
      );
      await ctx.answerCallbackQuery({ text: "Entwurf gespeichert!" });
    } catch (err) {
      console.error("[article] Error:", err);
      await ctx.editMessageText(`❌ Fehler: ${err.message}`);
      await ctx.answerCallbackQuery({ text: "Fehler beim Speichern" });
    }
  });

  bot.callbackQuery("article_no", async (ctx) => {
    const msgId = ctx.callbackQuery.message?.message_id;
    pendingTexts.delete(msgId);
    await ctx.editMessageText("OK, verworfen.");
    await ctx.answerCallbackQuery({ text: "Verworfen" });
  });
}
