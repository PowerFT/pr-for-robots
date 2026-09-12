import type { Resend } from "resend";

/** Both inboxes receive every registration and audit request. */
export const NOTIFY = ["hello@rosecreative.marketing", "samson@fitchtechnologies.com"];

/** Preferred sender. Requires rosecreative.marketing to be verified in Resend. */
const FROM = "PR for Robots <noreply@rosecreative.marketing>";
/** Resend's shared sending domain, available even before verification. */
const FROM_FALLBACK = "PR for Robots <onboarding@resend.dev>";

/**
 * Resend rejects a `from` on an unverified domain with one of these codes. The
 * message is checked too, since `validation_error` also covers unrelated
 * problems that should not silently downgrade the sender.
 */
function isUnverifiedDomain(error: { name: string; message: string }) {
  if (error.name === "invalid_from_address") return true;
  if (error.name !== "validation_error") return false;
  return /not verified|verify a domain|domain is not/i.test(error.message);
}

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
  to: string[];
  replyTo: string;
  subject: string;
  html: string;
  text: string;
};

/**
 * Sends from the rosecreative.marketing address, falling back to Resend's
 * shared domain — with a logged warning — if that domain isn't verified.
 */
export async function sendNotification(resend: Resend, message: Notification, tag: string) {
  let sent = await resend.emails.send({ ...message, from: FROM });

  if (sent.error && isUnverifiedDomain(sent.error)) {
    console.warn(
      `[${tag}] ${FROM} rejected (${sent.error.name}: ${sent.error.message}); falling back to ${FROM_FALLBACK}. Verify rosecreative.marketing in Resend.`,
    );
    sent = await resend.emails.send({ ...message, from: FROM_FALLBACK });
  }

  return sent;
}
