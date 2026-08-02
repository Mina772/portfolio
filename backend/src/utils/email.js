import nodemailer from "nodemailer";
import env from "../config/env.js";
import logger from "./logger.js";

let transporter = null;

/** Lazily create a reusable SMTP transporter when configured. */
function getTransporter() {
  if (!env.smtp.enabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
    });
  }
  return transporter;
}

/**
 * Send an email. Silently no-ops (with a warning) when SMTP is not configured,
 * so contact submissions never fail solely due to missing mail credentials.
 * @param {{to:string, subject:string, html:string, text?:string}} options
 */
export async function sendEmail({ to, subject, html, text }) {
  const t = getTransporter();
  if (!t) {
    logger.warn(`Email skipped (SMTP disabled): "${subject}" -> ${to}`);
    return { skipped: true };
  }
  const info = await t.sendMail({ from: env.smtp.from, to, subject, html, text });
  logger.info(`Email sent: ${info.messageId}`);
  return info;
}

/** Build a branded HTML notification for a new contact message. */
export const contactNotificationTemplate = ({ name, email, subject, message }) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:#4f46e5;color:#fff;padding:20px 24px">
      <h2 style="margin:0">New Portfolio Message</h2>
    </div>
    <div style="padding:24px;color:#111">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr style="border:none;border-top:1px solid #eee"/>
      <p style="white-space:pre-line">${message}</p>
    </div>
  </div>`;
