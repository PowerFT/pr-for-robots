import { formatGst, renderRows, sendNotification } from "@/lib/notify";

// Nodemailer needs Node's net/tls sockets.
export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, company, email, website } = (body ?? {}) as Record<string, unknown>;

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
  };

  const { html, text } = renderRows([
    ["Name", registrant.name],
    ["Company", registrant.company],
    ["Email", registrant.email],
    ["Submitted", `${formatGst(new Date())} (GST)`],
  ]);

  const sent = await sendNotification(
    {
      replyTo: registrant.email,
      // Header values must stay on one line.
      subject: `New webinar registration: ${registrant.name.replace(/[\r\n]+/g, " ")}`,
      html,
      text,
    },
    "register",
  );

  if (!sent) {
    return Response.json(
      { ok: false, error: "We could not complete your registration. Please try again." },
      { status: 502 },
    );
  }

  // TODO(zoom): register the attendee with the Zoom webinar here, once the Zoom
  // credentials are available. The `registrant` fields above are what the Zoom
  // `POST /webinars/{webinarId}/registrants` call needs. A failure there must
  // not fail this request — the notification email has already gone out — so
  // log the error and still return 200.

  return Response.json({ ok: true }, { status: 200 });
}
