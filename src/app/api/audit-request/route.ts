import { validateAuditRequest } from "@/lib/audit-request";
import { formatGst, renderRows, sendNotification } from "@/lib/notify";

// Nodemailer needs Node's net/tls sockets.
export const runtime = "nodejs";

/** Four short fields fit in this many times over; anything bigger is refused. */
const MAX_BODY_BYTES = 8 * 1024;

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

  const sent = await sendNotification(
    {
      replyTo: requester.email,
      // Header values must stay on one line.
      subject: `AI visibility audit request: ${requester.company.replace(/[\r\n]+/g, " ")}`,
      html,
      text,
    },
    "audit-request",
  );

  if (!sent) {
    return Response.json(
      { ok: false, error: "We couldn't send your request. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 200 });
}
