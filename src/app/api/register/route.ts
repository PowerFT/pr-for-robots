import { formatGst, renderRows, sendNotification } from "@/lib/notify";
import { addRegistrant } from "@/lib/zoom";

// Nodemailer needs Node's net/tls sockets.
export const runtime = "nodejs";
// Zoom token + registration + Gmail send, each with its own timeout.
export const maxDuration = 20;

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

  // Zoom requires a last name; a one-word name fills both.
  const [firstName, ...rest] = registrant.name.split(/\s+/);
  const lastName = rest.join(" ") || firstName;

  const zoom = await addRegistrant({
    email: registrant.email,
    firstName,
    lastName,
    company: registrant.company === "—" ? undefined : registrant.company,
  });

  // 409 means this email is already on the webinar, which is fine by us.
  const alreadyRegistered = !zoom.ok && zoom.status === 409;
  let zoomLine: string;
  if (zoom.ok) {
    zoomLine = `registered (registrant ID ${zoom.registrantId})`;
  } else if (alreadyRegistered) {
    zoomLine = "already registered";
  } else {
    zoomLine = `FAILED ${zoom.status}`;
    console.error("[register] Zoom registration failed", { status: zoom.status, body: zoom.body });
  }

  const { html, text } = renderRows([
    ["Name", registrant.name],
    ["Company", registrant.company],
    ["Email", registrant.email],
    ["Zoom", zoomLine],
    ["Submitted", `${formatGst(new Date())} (GST)`],
  ]);

  // Sent whatever Zoom said, so a failed registration still reaches a human.
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

  // Neither the join URL nor Zoom's error text ever goes back to the visitor.
  if (!(zoom.ok || alreadyRegistered) || !sent) {
    return Response.json(
      { ok: false, error: "We could not complete your registration. Please try again." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true }, { status: 200 });
}
