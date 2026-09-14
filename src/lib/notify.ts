import nodemailer, { type Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/** Both inboxes receive every registration and audit request. */
export const NOTIFY = ["samson@fitchtechnologies.com", "hello@rosecreative.marketing"];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Submission time rendered in Gulf Standard Time, the webinar's timezone. */
export function formatGst(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(date);
}

/** Label/value rows as a simple HTML table plus a plain-text twin. */
export function renderRows(rows: Array<[string, string]>) {
  const html = `<table style="font:15px/1.5 system-ui,sans-serif;border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(
          value,
        )}</strong></td></tr>`,
    )
    .join("")}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  return { html, text };
}

type Notification = {
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Created on the first send and reused while the function instance stays
 * warm. Deliberately not pooled: a serverless instance can be frozen between
 * requests, which would leave a pooled socket dead.
 */
let transporter: Transporter<SMTPTransport.SentMessageInfo> | undefined;

function getTransporter(user: string, pass: string) {
  transporter ??= nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
  return transporter;
}

/**
 * Sends the notification to both inboxes through Gmail SMTP, from the Gmail
 * account itself. Returns true once Gmail accepts at least one recipient;
 * accepted/rejected/messageId are logged either way.
 */
export async function sendNotification(message: Notification, tag: string) {
  const user = process.env.GMAIL_USER;
  // Google displays app passwords in groups of four; the spaces aren't part of it.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) {
    console.error(`[${tag}] GMAIL_USER or GMAIL_APP_PASSWORD is not set; cannot send notification`);
    return false;
  }

  let info: SMTPTransport.SentMessageInfo;
  try {
    info = await getTransporter(user, pass).sendMail({
      ...message,
      from: { name: "PR for Robots", address: user },
      to: NOTIFY,
    });
  } catch (error) {
    // Only the SMTP diagnostics — never the whole error object, which can carry
    // connection details.
    const { code, command, responseCode, response, message: reason } = (error ?? {}) as Record<
      string,
      unknown
    >;
    console.error(`[${tag}] Gmail SMTP send failed`, { code, command, responseCode, response, reason });
    return false;
  }

  const result = {
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    response: info.response,
  };
  if (info.accepted.length === 0) {
    console.error(`[${tag}] Gmail accepted no recipients`, result);
    return false;
  }
  if (info.rejected.length > 0) console.error(`[${tag}] Gmail rejected some recipients`, result);
  else console.log(`[${tag}] notification sent`, result);
  return true;
}
