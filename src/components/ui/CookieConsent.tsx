"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const COOKIE_KEY = "pelagic-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_KEY)) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setShow(false);
  }

  function reject() {
    localStorage.setItem(COOKIE_KEY, "necessary-only");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-[90] border-t border-pelagic-warm bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl text-sm leading-relaxed text-pelagic-steel">
          <p className="font-semibold text-pelagic-ink">Cookies</p>
          <p className="mt-1">
            We use essential cookies so the site works. With your consent we may
            use analytics cookies later to improve the site. See our{" "}
            <Link href="/contact" className="text-pelagic-gold underline">
              privacy policy
            </Link>{" "}
            (contact us for details).
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-full border border-pelagic-warm px-5 py-2.5 text-sm font-semibold text-pelagic-steel transition hover:border-pelagic-gold"
          >
            Necessary only
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-pelagic-gold px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-pelagic-gold-light"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
