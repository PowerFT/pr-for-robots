import { Resend } from "resend";

import { validateAuditRequest } from "@/lib/audit-request";
import { NOTIFY, formatGst, renderRows, sendNotification } from "@/lib/notify";

/** Four short fields fit in this many times over; anything bigger is refused. */
const MAX_BODY_BYTES = 8 * 1024;

const failed = () =>
  Response.json(
    { ok: false, error: "We couldn't send your request. Please try again." },
    { status: 502 },
  );

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return Response.json({ ok: false, error: "Expected application/json" }, { status: 415 });
  }

  // Refuse early on the declared length, then check what actually arrived —
  // Content-Length can be missing or wrong.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large" }, { status: 413 });
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "Request too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;

  // Honeypot: the `fax` input is hidden from real users, so anything in it is a
  // bot. Answer 200 so the bot sees success and does not retry, but send
  // nothing.
  if (typeof input.fax === "string" && input.fax.trim()) {
    console.warn("[audit-request] honeypot tripped, dropping submission");
    return Response.json({ ok: true }, { status: 200 });
  }

  const result = validateAuditRequest(input);
  if (!result.ok) {
    return Response.json(
      { ok: false, error: "Please check the highlighted fields.", fields: result.errors },
      { status: 400 },
    );
  }
  const requester = result.values;

  const { html, text } = renderRows([
    ["Name", requester.name],
    ["Email", requester.email],
    ["Company", requester.company],
    ["Website", requester.website],
    ["Submitted", `${formatGst(new Date())} (GST)`],
  ]);
  const message = {
    to: NOTIFY,
    replyTo: requester.email,
    // Header values must stay on one line.
    subject: `AI visibility audit request: ${requester.company.replace(/[\r\n]+/g, " ")}`,
    html,
    text,
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Local development without the key: log what would have been sent so the
    // form can still be exercised end to end. In production this is an outage.
    if (process.env.NODE_ENV !== "production") {
      console.log("[audit-request] RESEND_API_KEY is not set — email NOT sent (dev stub)", {
        to: message.to,
        replyTo: message.replyTo,
        subject: message.subject,
        text: message.text,
      });
      return Response.json({ ok: true, stubbed: true }, { status: 200 });
    }
    console.error("[audit-request] RESEND_API_KEY is not set; cannot send audit request");
    return failed();
  }

  let sent: Awaited<ReturnType<typeof sendNotification>>;
  try {
    sent = await sendNotification(new Resend(apiKey), message, "audit-request");
  } catch (error) {
    console.error("[audit-request] Resend request threw", error);
    return failed();
  }

  if (sent.error) {
    console.error("[audit-request] Resend rejected the audit request", sent.error);
    return failed();
  }

  console.log("[audit-request] notification sent", { id: sent.data?.id, company: requester.company });
  return Response.json({ ok: true }, { status: 200 });
}
