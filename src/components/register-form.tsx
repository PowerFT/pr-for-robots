"use client";

import { useState } from "react";

const fieldWrap =
  "flex items-center gap-3 border border-hairline rounded-card bg-bg px-3.5";
const fieldInput =
  "flex-1 bg-transparent border-none text-white text-[15px] py-[15px] outline-none placeholder:text-[#6b6b6b]";

export function RegisterForm() {
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3.5"
    >
      <div className={fieldWrap}>
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
          <circle cx="9" cy="6" r="3.2" stroke="#7a7a7a" strokeWidth="1.4" />
          <path d="M3 16c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="#7a7a7a" strokeWidth="1.4" />
        </svg>
        <input name="name" type="text" placeholder="Name" required aria-label="Name" className={fieldInput} />
      </div>

      <div className={fieldWrap}>
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
          <rect x="2.5" y="2.5" width="9" height="13" stroke="#7a7a7a" strokeWidth="1.4" />
          <rect x="11.5" y="7.5" width="4" height="8" stroke="#7a7a7a" strokeWidth="1.4" />
          <path d="M5 5.5h4M5 8.5h4M5 11.5h4" stroke="#7a7a7a" strokeWidth="1.2" />
        </svg>
        <input name="company" type="text" placeholder="Company" aria-label="Company" className={fieldInput} />
      </div>

      <div className={fieldWrap}>
        <svg width="17" height="17" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
          <rect x="1.5" y="4" width="15" height="10" rx="1.5" stroke="#7a7a7a" strokeWidth="1.4" />
          <path d="M2 5l7 5 7-5" stroke="#7a7a7a" strokeWidth="1.4" />
        </svg>
        <input name="email" type="email" placeholder="Email" required aria-label="Email" className={fieldInput} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 bg-brand-orange text-white rounded-card px-6 py-[17px] text-sm font-bold tracking-[0.14em] uppercase cursor-pointer transition-colors hover:bg-[#ff7a2e] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {pending ? "Registering…" : "Register Now"}
      </button>

      <div className="flex items-center gap-2.5 text-[#7a7a7a] text-[12.5px]">
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
          <rect x="3.5" y="7.5" width="11" height="8" rx="1.3" stroke="#7a7a7a" strokeWidth="1.4" />
          <path d="M6 7.5V5.5a3 3 0 016 0v2" stroke="#7a7a7a" strokeWidth="1.4" />
        </svg>
        <span>We respect your privacy. No spam. Unsubscribe anytime.</span>
      </div>

      {error ? (
        <div className="text-[13px] text-brand-orange border-t border-hairline pt-3" role="alert">
          {error}
        </div>
      ) : null}

      {submitted ? (
        <div className="text-[13px] text-brand-teal border-t border-hairline pt-3" role="status">
          Thanks — your seat is saved. Check your inbox for the joining link.
        </div>
      ) : null}
    </form>
  );
}
