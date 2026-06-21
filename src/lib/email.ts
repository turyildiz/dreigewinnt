import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT ?? "587", 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM ?? "info@dreigewinnt.com";

export async function sendApprovalEmail({
  to,
  partnerName,
  profileUrl,
  telegramCode,
}: {
  to: string;
  partnerName: string;
  profileUrl: string;
  telegramCode: string | null;
}) {
  const codeBlock = telegramCode
    ? `
        <div style="background:#f0f3ff;padding:20px;margin:20px 0;text-align:center">
          <p style="margin:0 0 8px;font-size:13px;color:#46464c">Ihr Telegram-Code:</p>
          <p style="margin:0;font-size:32px;font-weight:900;letter-spacing:4px;color:#020511">${telegramCode}</p>
        </div>
        <h3 style="color:#020511;font-size:16px;margin:24px 0 12px">So verknüpfen Sie Ihr Profil:</h3>
        <ol style="color:#46464c;font-size:14px;line-height:1.8;padding-left:20px">
          <li>Öffnen Sie Telegram und suchen Sie nach <strong>@dreigewinnt_bot</strong></li>
          <li>Starten Sie den Bot und senden Sie Ihren Code: <strong>${telegramCode}</strong></li>
          <li>Ab sofort können Sie Ihr Profil direkt über Telegram verwalten — Bilder, Texte, Beiträge und mehr</li>
        </ol>`
    : "";

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Inter,Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#020511">
  <div style="border-bottom:3px solid #006d42;padding-bottom:16px;margin-bottom:24px">
    <h1 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-0.5px">DREIGEWINNT<span style="color:#735c00;font-weight:300">.COM</span></h1>
  </div>

  <h2 style="color:#006d42;font-size:20px;margin:0 0 16px">Willkommen bei Dreigewinnt!</h2>

  <p style="font-size:15px;line-height:1.6;color:#46464c">
    Ihr Eintrag <strong style="color:#020511">${partnerName}</strong> wurde geprüft und freigeschaltet.
    Ihr Profil ist ab sofort auf dreigewinnt.com sichtbar.
  </p>

  <a href="${profileUrl}" style="display:inline-block;background:#006d42;color:white;text-decoration:none;padding:12px 24px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:16px 0">
    Profil ansehen
  </a>

  ${codeBlock}

  <hr style="border:none;border-top:1px solid #dee8ff;margin:32px 0">

  <p style="font-size:12px;color:#46464c;line-height:1.6">
    Bei Fragen erreichen Sie uns unter <a href="mailto:info@dreigewinnt.com" style="color:#006d42">info@dreigewinnt.com</a>.<br>
    Dreigewinnt — Das lokale Verzeichnis für Raunheim, Kelsterbach und Rüsselsheim.
  </p>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Dreigewinnt" <${FROM}>`,
    to,
    subject: `${partnerName} — Ihr Eintrag ist live auf dreigewinnt.com`,
    html,
  });
}
