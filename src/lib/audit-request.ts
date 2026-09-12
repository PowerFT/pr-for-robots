/**
 * Validation for the AI visibility audit request, shared by the modal form and
 * /api/audit-request so the browser and the server accept exactly the same
 * input.
 */

export type AuditRequestFields = {
  name: string;
  email: string;
  company: string;
  website: string;
};

export type AuditRequestErrors = Partial<Record<keyof AuditRequestFields, string>>;

const MAX_LENGTH: Record<keyof AuditRequestFields, number> = {
  name: 200,
  email: 254,
  company: 200,
  website: 2048,
};

/** Deliberately loose: something@something.tld, no spaces. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Prepends https:// when no scheme is given, then requires an http(s) URL with
 * a dotted host. Returns the tidied URL (no lone trailing slash) or null.
 */
export function normaliseWebsite(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.pathname === "/" && !url.search && !url.hash ? url.origin : url.href;
  } catch {
    return null;
  }
}

export function validateAuditRequest(
  input: Record<string, unknown>,
): { ok: true; values: AuditRequestFields } | { ok: false; errors: AuditRequestErrors } {
  const text = (key: keyof AuditRequestFields) => {
    const value = input[key];
    return typeof value === "string" ? value.trim() : "";
  };
  const name = text("name");
  const email = text("email");
  const company = text("company");
  const rawWebsite = text("website");
  const website = normaliseWebsite(rawWebsite);
  const errors: AuditRequestErrors = {};

  if (!name) errors.name = "Enter your name.";
  else if (name.length > MAX_LENGTH.name) errors.name = "That name is too long.";

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > MAX_LENGTH.email || !EMAIL.test(email))
    errors.email = "Enter a valid email address, like name@company.com.";

  if (!company) errors.company = "Enter your company name.";
  else if (company.length > MAX_LENGTH.company) errors.company = "That company name is too long.";

  if (!rawWebsite) errors.website = "Enter your website URL.";
  else if (!website || website.length > MAX_LENGTH.website)
    errors.website = "Enter a valid website address, like company.com.";

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values: { name, email, company, website: website! } };
}
