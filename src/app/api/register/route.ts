export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, company, email } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return Response.json({ ok: false, error: "Name is required" }, { status: 400 });
  }
  if (typeof email !== "string" || !email.includes("@")) {
    return Response.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  // No provider wired up yet — log the registration so it is visible in the
  // Vercel runtime logs until a real service is connected.
  console.log("[register]", {
    name: name.trim(),
    company: typeof company === "string" ? company.trim() : "",
    email: email.trim(),
    at: new Date().toISOString(),
  });

  return Response.json({ ok: true }, { status: 200 });
}
