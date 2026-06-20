import "./env.mjs";
import { Bot } from "grammy";
import { supabase } from "./lib/supabase.mjs";
import { registerPhotoHandler } from "./handlers/photo.mjs";
import { registerTextHandler } from "./handlers/text.mjs";

const token = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
if (!token) {
  console.error("TELEGRAM_ADMIN_BOT_TOKEN not set");
  process.exit(1);
}

const adminIds = (process.env.TELEGRAM_ADMIN_USER_IDS ?? "")
  .split(",")
  .map((id) => parseInt(id.trim(), 10))
  .filter(Boolean);

const bot = new Bot(token);

bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId || !adminIds.includes(userId)) {
    await ctx.reply("⛔ Zugriff verweigert.").catch(() => {});
    return;
  }
  await next();
});

bot.command("start", async (ctx) => {
  await ctx.reply(
    [
      "🏠 *Dreigewinnt Admin Bot*",
      "",
      "Ich helfe dir, Events und News direkt hier zu veröffentlichen\\.",
      "",
      "📸 *Foto senden* → Event aus Poster erstellen",
      "✍️ *Text senden* → Nachrichtenartikel erstellen",
      "📊 /stats → Aktuelle Statistiken",
      "❓ /help → Alle Befehle",
    ].join("\n"),
    { parse_mode: "MarkdownV2" }
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    [
      "*Befehle:*",
      "",
      "/start — Willkommen",
      "/stats — Statistiken \\(Gewerbe, Clubs, Events, News\\)",
      "/help — Diese Hilfe",
      "",
      "*Aktionen:*",
      "",
      "📸 Foto eines Event\\-Posters senden → Event wird automatisch erkannt und kann direkt veröffentlicht werden",
      "✍️ Text senden → Wird als Nachrichtenartikel\\-Entwurf gespeichert",
    ].join("\n"),
    { parse_mode: "MarkdownV2" }
  );
});

bot.command("stats", async (ctx) => {
  try {
    const [biz, clubs, events, articles] = await Promise.all([
      supabase.from("businesses").select("*", { count: "exact", head: true }),
      supabase.from("clubs").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("articles").select("*", { count: "exact", head: true }),
    ]);

    await ctx.reply(
      [
        "📊 *Dreigewinnt Statistiken*",
        "",
        `🏪 Gewerbe: ${biz.count ?? "?"}`,
        `⚽ Sportvereine: ${clubs.count ?? "?"}`,
        `📅 Events \\(aktiv\\): ${events.count ?? "?"}`,
        `📰 Nachrichten: ${articles.count ?? "?"}`,
      ].join("\n"),
      { parse_mode: "MarkdownV2" }
    );
  } catch (err) {
    console.error("[stats] Error:", err);
    await ctx.reply(`❌ Fehler beim Laden der Statistiken: ${err.message}`);
  }
});

registerPhotoHandler(bot);
registerTextHandler(bot);

bot.catch((err) => {
  console.error("[bot] Unhandled error:", err);
});

console.log("[admin-bot] Starting…");
bot.start({
  onStart: () => console.log("[admin-bot] Running as @dreigewinnt_admin_bot"),
});

function shutdown() {
  console.log("[admin-bot] Shutting down…");
  bot.stop();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
