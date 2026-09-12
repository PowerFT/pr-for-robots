import { Resend } from "resend";

import { NOTIFY, formatGst, renderRows, sendNotification } from "@/lib/notify";

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

  const { html, text } = renderRows([
    ["Name", registrant.name],
    ["Company", registrant.company],
    ["Email", registrant.email],
    ["Submitted", `${registrant.at} (GST)`],
    ["Page", registrant.page],
  ]);

  const sent = await sendNotification(
    resend,
    {
      to: NOTIFY,
      replyTo: registrant.email,
      subject: `New webinar registration: ${registrant.name}`,
      html,
      text,
    },
    "register",
  );

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
