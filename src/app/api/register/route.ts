import { Resend } from "resend";

/** Both registration inboxes receive every submission. */
const NOTIFY = ["hello@rosecreative.marketing", "samson@fitchtechnologies.com"];

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
function formatGst(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Dubai",
  }).format(date);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, company, email, website, pageUrl } = (body ?? {}) as Record<string, unknown>;

  // Honeypot: the `website` input is hidden from real users, so anything in it
  // is a bot. Answer 200 so the bot sees success and does not retry, but send
  // nothing.
  if (typeof website === "string" && website.trim()) {
    console.warn("[register] honeypot tripped, dropping submission");
    return Response.json({ ok: true }, { status: 200 });
  }

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ ok: false, error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return Response.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  const registrant = {
    name: name.trim(),
    company: typeof company === "string" && company.trim() ? company.trim() : "—",
    email: email.trim(),
    at: formatGst(new Date()),
    page:
      typeof pageUrl === "string" && pageUrl.trim()
        ? pageUrl.trim()
        : request.headers.get("referer") ?? "—",
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[register] RESEND_API_KEY is not set; cannot send notification");
    return Response.json(
      { ok: false, error: "We could not complete your registration. Please try again." },
      { status: 502 },
    );
  }

  const resend = new Resend(apiKey);

  const rows: Array<[string, string]> = [
    ["Name", registrant.name],
    ["Company", registrant.company],
    ["Email", registrant.email],
    ["Submitted", `${registrant.at} (GST)`],
    ["Page", registrant.page],
  ];

  const html = `<table style="font:15px/1.5 system-ui,sans-serif;border-collapse:collapse">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666">${label}</td><td style="padding:4px 0"><strong>${escapeHtml(
          value,
        )}</strong></td></tr>`,
    )
    .join("")}</table>`;
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const message = {
    to: NOTIFY,
    replyTo: registrant.email,
    subject: `New webinar registration: ${registrant.name}`,
    html,
    text,
  };

  let sent = await resend.emails.send({ ...message, from: FROM });

  if (sent.error && isUnverifiedDomain(sent.error)) {
    console.warn(
      `[register] ${FROM} rejected (${sent.error.name}: ${sent.error.message}); falling back to ${FROM_FALLBACK}. Verify rosecreative.marketing in Resend.`,
    );
    sent = await resend.emails.send({ ...message, from: FROM_FALLBACK });
  }

  if (sent.error) {
    console.error("[register] Resend rejected the notification", sent.error);
    return Response.json(
      { ok: false, error: "We could not complete your registration. Please try again." },
      { status: 502 },
    );
  }

  console.log("[register] notification sent", { id: sent.data?.id, email: registrant.email });

  // TODO(zoom): register the attendee with the Zoom webinar here, once the Zoom
  // credentials are available. The `registrant` fields above are what the Zoom
  // `POST /webinars/{webinarId}/registrants` call needs. A failure there must
  // not fail this request — the notification email has already gone out — so
  // log the error and still return 200.

  return Response.json({ ok: true }, { status: 200 });
}
