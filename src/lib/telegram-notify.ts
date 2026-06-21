const BOT_TOKEN = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
const ADMIN_IDS = (process.env.TELEGRAM_ADMIN_USER_IDS ?? "").split(",").filter(Boolean);

export async function notifyAdmins(message: string) {
  if (!BOT_TOKEN || ADMIN_IDS.length === 0) return;

  for (const chatId of ADMIN_IDS) {
    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "HTML" }),
      });
    } catch {
      // don't block submissions if notification fails
    }
  }
}
