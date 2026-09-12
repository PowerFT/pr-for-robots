"use client";

import { useEffect, useId, useRef, useState } from "react";

import {
  type AuditRequestErrors,
  type AuditRequestFields,
  normaliseWebsite,
  validateAuditRequest,
} from "@/lib/audit-request";

type Status = "idle" | "pending" | "sent" | "error";

const FIELDS: Array<{
  name: keyof AuditRequestFields;
  label: string;
  type: "text" | "email";
  autoComplete: string;
  placeholder: string;
  inputMode?: "email" | "url";
}> = [
  { name: "name", label: "Name", type: "text", autoComplete: "name", placeholder: "Your name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@company.com", inputMode: "email" },
  { name: "company", label: "Company name", type: "text", autoComplete: "organization", placeholder: "Company" },
  { name: "website", label: "Website URL", type: "text", autoComplete: "url", placeholder: "company.com", inputMode: "url" },
];

/** Everything Tab can land on inside the dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const fieldInput =
  "w-full rounded-card border border-hairline bg-bg px-3.5 py-[13px] text-[15px] text-white outline-none transition-colors placeholder:text-[#6b6b6b] focus:border-brand-teal aria-[invalid=true]:border-brand-orange";
const primaryButton =
  "rounded-card bg-brand-orange px-6 py-[17px] text-sm font-bold uppercase tracking-[0.14em] text-white cursor-pointer transition-colors hover:bg-[#ff7a2e] aria-disabled:cursor-not-allowed aria-disabled:opacity-70";

/**
 * "Request an AI Visibility Audit": the trigger button plus a modal contact
 * form. Built on <dialog>.showModal(), which puts the form in the top layer and
 * makes the page behind it inert; on top of that we keep Tab cycling inside
 * the dialog, close on Esc and backdrop click, lock page scroll while open,
 * and hand focus back to the trigger on close.
 */
export function AuditRequest({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeAfterSendRef = useRef<HTMLButtonElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const isOpen = useRef(false);
  const pressStartedOnBackdrop = useRef(false);

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<AuditRequestErrors>({});

  const titleId = useId();
  const descriptionId = useId();
  const fieldId = useId();

  // Lock page scroll while open. Pad by the scrollbar width so the page
  // behind doesn't jump sideways when the scrollbar disappears.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    return () => {
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [open]);

  // The submit button is disabled while sending, which drops focus; put it
  // somewhere useful once the outcome is on screen.
  useEffect(() => {
    if (status === "sent") closeAfterSendRef.current?.focus();
    if (status === "error") retryRef.current?.focus();
  }, [status]);

  function openDialog() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    isOpen.current = true;
    setOpen(true);
    firstFieldRef.current?.focus();
  }

  /**
   * Every close path — Esc, backdrop, ✕ and Close — calls closeDialog, which
   * closes and cleans up directly instead of waiting for the dialog's `close`
   * event: Chrome can deliver that event late (or, after an Esc dismissal, not
   * promptly at all), which left the page scroll-locked.
   */
  function closeDialog() {
    dialogRef.current?.close();
    finishClose();
  }

  /** Unlock scroll, reset a sent form and return focus. Safe to call twice. */
  function finishClose() {
    if (!isOpen.current) return;
    isOpen.current = false;
    setOpen(false);
    // A sent request starts fresh next time; an unsent one keeps its values.
    setStatus((current) => (current === "sent" ? "idle" : current));
    triggerRef.current?.focus();
  }

  /**
   * Backstop for closes we didn't initiate. A late `close` event from an
   * earlier dismissal can arrive after the dialog has been reopened, so only
   * act if it really is closed now.
   */
  function handleNativeClose() {
    if (dialogRef.current?.open) return;
    finishClose();
  }

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    closeDialog();
  }

  function trapTab(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // The dialog box is fully covered by its panel, so a click whose target is
  // the <dialog> itself landed on the ::backdrop. Requiring the press to start
  // there too stops a text selection dragged out of the form from closing it.
  function handleBackdropPointerDown(event: React.PointerEvent<HTMLDialogElement>) {
    pressStartedOnBackdrop.current = event.target === event.currentTarget;
  }
  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (pressStartedOnBackdrop.current && event.target === event.currentTarget) closeDialog();
    pressStartedOnBackdrop.current = false;
  }

  function clearError(name: keyof AuditRequestFields) {
    if (!errors[name]) return;
    setErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    const result = validateAuditRequest(input);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      const firstInvalid = FIELDS.find((field) => result.errors[field.name]);
      if (firstInvalid) (form.elements.namedItem(firstInvalid.name) as HTMLInputElement | null)?.focus();
      return;
    }

    setErrors({});
    // Show the URL we'll actually send, e.g. with https:// added.
    (form.elements.namedItem("website") as HTMLInputElement).value = result.values.website;
    setStatus("pending");

    try {
      const response = await fetch("/api/audit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.values, fax: String(data.get("fax") ?? "") }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        fields?: AuditRequestErrors;
      };

      if (response.ok && body.ok) {
        setStatus("sent");
      } else if (response.status === 400 && body.fields) {
        setErrors(body.fields);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-haspopup="dialog"
        className={`cursor-pointer ${className}`}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onCancel={handleCancel}
        onClose={handleNativeClose}
        onKeyDown={trapTab}
        onPointerDown={handleBackdropPointerDown}
        onClick={handleBackdropClick}
        className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[520px] overflow-y-auto rounded-card border border-hairline bg-card p-0 text-white backdrop:bg-black/75"
      >
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2
                id={titleId}
                className="m-0 text-[22px] font-bold leading-[1.15] tracking-[-0.015em] text-brand-teal md:text-[26px]"
              >
                Request an AI Visibility Audit
              </h2>
              <p id={descriptionId} className="m-0 text-[14.5px] leading-[1.6] text-body">
                Tell us who you are and which site to review, and we&rsquo;ll look at how AI sees
                your brand.
              </p>
            </div>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close"
              className="-mr-2 -mt-1 flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-card text-body transition-colors hover:text-white"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          {status === "sent" ? (
            <div className="flex flex-col items-start gap-5" role="status">
              <p className="m-0 text-[16px] leading-relaxed text-brand-teal">
                Thanks — we&rsquo;ve received your request and will be in touch shortly.
              </p>
              <button
                ref={closeAfterSendRef}
                type="button"
                onClick={closeDialog}
                className="cursor-pointer rounded-card border border-brand-teal px-6 py-[13px] text-sm font-bold uppercase tracking-[0.12em] text-brand-teal transition-colors hover:bg-brand-teal/10"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {FIELDS.map((field, index) => {
                const id = `${fieldId}-${field.name}`;
                const error = errors[field.name];
                return (
                  <div key={field.name} className="flex flex-col gap-1.5">
                    <label htmlFor={id} className="text-[13px] font-medium text-body">
                      {field.label}
                    </label>
                    <input
                      ref={index === 0 ? firstFieldRef : undefined}
                      id={id}
                      name={field.name}
                      type={field.type}
                      inputMode={field.inputMode}
                      autoComplete={field.autoComplete}
                      placeholder={field.placeholder}
                      required
                      aria-required="true"
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${id}-error` : undefined}
                      autoCapitalize={field.name === "website" || field.name === "email" ? "none" : undefined}
                      spellCheck={field.name === "website" || field.name === "email" ? false : undefined}
                      onInput={() => clearError(field.name)}
                      onBlur={
                        field.name === "website"
                          ? (event) => {
                              const url = normaliseWebsite(event.currentTarget.value);
                              if (url) event.currentTarget.value = url;
                            }
                          : undefined
                      }
                      className={fieldInput}
                    />
                    {error ? (
                      <p id={`${id}-error`} className="m-0 text-[12.5px] text-brand-orange">
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              {/* Honeypot: hidden from people, irresistible to bots. Submissions
                  that fill it in are dropped server-side. */}
              <input
                name="fax"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {/* aria-disabled rather than disabled: a disabled button drops
                  focus to <body> mid-dialog; this one keeps it. */}
              <button type="submit" aria-disabled={status === "pending"} className={`mt-1 ${primaryButton}`}>
                {status === "pending" ? "Sending…" : "Request Audit"}
              </button>

              {status === "error" ? (
                <div className="border-t border-hairline pt-3 text-[13px] text-brand-orange" role="alert">
                  We couldn&rsquo;t send your request. Please try again.{" "}
                  <button ref={retryRef} type="submit" className="cursor-pointer underline underline-offset-2">
                    Retry
                  </button>
                </div>
              ) : null}
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
