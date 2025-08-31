import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 2525),
  secure: process.env.SMTP_SECURE === "true", // true:465 / false:587
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

const FROM = process.env.EMAIL_FROM!;

export async function sendVerifyEmail(opts: { to: string; name?: string | null; verifyUrl: string }) {
  const subject = "Vérifiez votre adresse email";
  const html = verifyTemplateHTML(opts.name ?? "Bonjour", opts.verifyUrl);
  return transporter.sendMail({ from: FROM, to: opts.to, subject, html });
}

export async function sendNewMessageEmail(opts: {
  to: string;
  name?: string | null;
  toyTitle: string;
  preview: string;
  conversationUrl: string;
}) {
  const subject = `Nouveau message à propos de “${opts.toyTitle}”`;
  const html = newMessageTemplateHTML(opts.name ?? "Bonjour", opts.toyTitle, opts.preview, opts.conversationUrl);
  return transporter.sendMail({ from: FROM, to: opts.to, subject, html });
}

export async function sendReportEmail(opts: {
  to: string;
  toyTitle: string;
  toyId: string;
  ownerName?: string | null;
  ownerEmail: string;
  reason: string;
  message: string;
  reporterName?: string | null;
  reporterEmail: string;
}) {
  const subject = `🚨 Signalement : ${opts.reason} – ${opts.toyTitle}`;
  const html = reportTemplateHTML(opts);
  return transporter.sendMail({ from: FROM, to: opts.to, subject, html });
}

/* ---------------- TEMPLATES (HTML simples, dark-ish) ---------------- */

function baseWrap(content: string) {
  return `
  <div style="background:#0b1020;padding:32px 0;font-family:Inter,Arial,Helvetica,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#11162a;border-radius:12px;padding:24px;">
            <tr><td>
              <h1 style="margin:0 0 8px 0;color:#fff;font-size:20px;">ToyExchange</h1>
              ${content}
              <p style="color:#8f95a7;font-size:12px;margin-top:16px">Si vous n'êtes pas à l'origine de cette action, vous pouvez ignorer cet email.</p>
            </td></tr>
          </table>
        </td>
      </tr>
    </table>
  </div>`;
}

function button(url: string, label: string) {
  return `<a href="${url}" style="background:linear-gradient(90deg,#06b6d4,#8b5cf6);color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;display:inline-block">${label}</a>`;
}

function verifyTemplateHTML(name: string, verifyUrl: string) {
  return baseWrap(`
    <h2 style="color:#fff;margin:0 0 12px 0;font-size:18px;">Vérifiez votre adresse email</h2>
    <p style="color:#c3c7d3;font-size:14px;line-height:22px;margin:0 0 16px 0;">
      ${name}, cliquez ci-dessous pour confirmer votre adresse email et activer votre compte.
    </p>
    <div style="margin:16px 0">${button(verifyUrl, "Confirmer mon email")}</div>
    <p style="color:#8f95a7;font-size:12px;margin:8px 0 0 0">Ce lien expire dans 24 heures.</p>
    <p style="color:#8f95a7;font-size:12px;word-break:break-all;margin:8px 0 0 0">${verifyUrl}</p>
  `);
}

function newMessageTemplateHTML(name: string, toyTitle: string, preview: string, conversationUrl: string) {
  return baseWrap(`
    <h2 style="color:#fff;margin:0 0 12px 0;font-size:18px;">Nouveau message reçu</h2>
    <p style="color:#c3c7d3;font-size:14px;margin:0 0 8px 0;">
      ${name}, vous avez reçu un nouveau message à propos de <b>“${escapeHTML(toyTitle)}”</b>.
    </p>
    <blockquote style="color:#adb2c3;background:#0f1427;padding:12px;border-radius:8px;margin:12px 0;font-size:14px;">
      “${escapeHTML(preview)}”
    </blockquote>
    <div style="margin:16px 0">${button(conversationUrl, "Ouvrir la conversation")}</div>
  `);
}

function reportTemplateHTML(opts: {
  toyTitle: string;
  toyId: string;
  ownerName?: string | null;
  ownerEmail: string;
  reason: string;
  message: string;
  reporterName?: string | null;
  reporterEmail: string;
}) {
  return baseWrap(`
    <h2 style="color:#fff;margin:0 0 12px 0;font-size:18px;">🚨 Nouveau signalement</h2>
    <p style="color:#c3c7d3;font-size:14px;margin:0 0 12px 0;">
      Un utilisateur a signalé le jouet <b>“${escapeHTML(opts.toyTitle)}”</b>.
    </p>
    <div style="background:#0f1427;padding:12px;border-radius:8px;margin:12px 0;">
      <p style="color:#adb2c3;font-size:14px;margin:0"><b>Raison :</b> ${escapeHTML(opts.reason)}</p>
      <p style="color:#adb2c3;font-size:14px;margin:8px 0 0 0"><b>Détails :</b><br>${escapeHTML(opts.message)}</p>
    </div>
    <h4 style="color:#fff;margin:16px 0 8px 0;font-size:16px;">📦 Jouet</h4>
    <p style="color:#adb2c3;font-size:14px;margin:0">
      Propriétaire : ${opts.ownerName || "Nom inconnu"} (${opts.ownerEmail})<br>
      Lien : <a href="${process.env.NEXT_PUBLIC_APP_URL}/toys/${opts.toyId}" style="color:#06b6d4">${process.env.NEXT_PUBLIC_APP_URL}/toys/${opts.toyId}</a>
    </p>
    <h4 style="color:#fff;margin:16px 0 8px 0;font-size:16px;">👤 Signaleur</h4>
    <p style="color:#adb2c3;font-size:14px;margin:0">
      ${opts.reporterName || "Utilisateur anonyme"} (${opts.reporterEmail})
    </p>
  `);
}

function escapeHTML(s?: string) {
  if (!s) return "";
  return s.replace(/[&<>"']/g, (c) => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]!
  ));
}
