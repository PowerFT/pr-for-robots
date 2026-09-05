"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Wordmark } from "@/components/wordmark";

const links = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Previous Webinars", href: "#webinars" },
  { label: "Contact Us", href: "#contact" },
];

const linkStyle = "text-white transition-colors hover:text-brand-teal";

export function SiteNav() {
  const [open, setOpen] = useState(false);

  // Drop the mobile menu if the viewport grows back to the desktop layout,
  // otherwise it stays mounted but hidden and the toggle gets out of sync.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const close = () => setOpen(false);
    desktop.addEventListener("change", close);
    return () => desktop.removeEventListener("change", close);
  }, []);

  /**
   * Drive the scroll ourselves so Home can return to the top and so the URL
   * keeps a clean hash. Anchors keep their href, so modified clicks still open
   * a new tab and the links read correctly to assistive tech; scroll-margin-top
   * on each target clears the sticky nav.
   */
  function handleNavigate(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    setOpen(false);

    // Let modified clicks (new tab/window) and non-primary buttons behave normally.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    if (href === "#top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", window.location.pathname + window.location.search);
      return;
    }

    const target = document.querySelector(href);
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-bg/80 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 lg:px-12 3xl:max-w-[1440px]"
      >
        <Link
          href="/"
          onClick={(event) => handleNavigate(event, "#top")}
          aria-label="PR for Robots — home"
          className="inline-flex items-center"
        >
          <Wordmark size="nav" />
        </Link>

        <ul className="hidden items-center gap-8 text-[13px] font-medium md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => handleNavigate(event, link.href)}
                className={linkStyle}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 flex h-10 w-10 items-center justify-center text-white transition-colors hover:text-brand-teal md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          )}
        </button>
      </nav>

      {open ? (
        <div id="mobile-menu" className="border-t border-hairline bg-bg md:hidden">
          <ul className="mx-auto flex w-full max-w-[1200px] flex-col px-6 py-2 text-sm font-medium lg:px-12 3xl:max-w-[1440px]">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(event) => handleNavigate(event, link.href)}
                  className={`block py-3 ${linkStyle}`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </header>
  );
}
