/**
 * Zoom webinar registration through a Server-to-Server OAuth app
 * (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_WEBINAR_ID).
 */

/** Keeps each Zoom call well inside the route's 20s budget. */
const TIMEOUT_MS = 8_000;

/** Reused while the function instance stays warm; refreshed 60s before expiry. */
let cachedToken: { value: string; expiresAt: number } | undefined;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

export async function getAccessToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.value;

  const accountId = requireEnv("ZOOM_ACCOUNT_ID");
  const basic = Buffer.from(`${requireEnv("ZOOM_CLIENT_ID")}:${requireEnv("ZOOM_CLIENT_SECRET")}`).toString(
    "base64",
  );

  const response = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${basic}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  );
  if (!response.ok) {
    throw new Error(`Zoom token request failed: ${response.status} ${await response.text()}`);
  }

  const { access_token, expires_in } = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };
  cachedToken = { value: access_token, expiresAt: Date.now() + (expires_in - 60) * 1000 };
  return access_token;
}

export type Registrant = {
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
};

export type AddRegistrantResult =
  | { ok: true; joinUrl: string; registrantId: string }
  | { ok: false; status: number; body: string };

/**
 * Registers one attendee. Zoom emails them their personal join link. Any
 * non-201 answer is handed back untouched so the caller decides what it means;
 * a token or network failure comes back as status 0.
 */
export async function addRegistrant({ email, firstName, lastName, company }: Registrant): Promise<AddRegistrantResult> {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `https://api.zoom.us/v2/webinars/${encodeURIComponent(requireEnv("ZOOM_WEBINAR_ID"))}/registrants`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ email, first_name: firstName, last_name: lastName, org: company }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      },
    );

    if (response.status !== 201) {
      return { ok: false, status: response.status, body: await response.text() };
    }
    const { join_url, registrant_id } = (await response.json()) as { join_url: string; registrant_id: string };
    return { ok: true, joinUrl: join_url, registrantId: registrant_id };
  } catch (error) {
    return { ok: false, status: 0, body: error instanceof Error ? error.message : String(error) };
  }
}
