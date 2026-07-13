"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  CONSENT_OPEN_EVENT,
  defaultConsent,
  openCookieSettings,
  readConsent,
  writeConsent,
  type ConsentPreferences,
} from "@/lib/consent";

export { openCookieSettings };

type View = "banner" | "preferences";

function Toggle({
  id,
  checked,
  disabled,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-pelagic-accent" : "bg-pelagic-warm"
      } ${disabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export function CookieConsent() {
  const titleId = useId();
  const descId = useId();
  const [show, setShow] = useState(false);
  const [view, setView] = useState<View>("banner");
  const [analytics, setAnalytics] = useState(false);
  const [preferences, setPreferences] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setShow(true);
    else {
      setAnalytics(existing.analytics);
      setPreferences(existing.preferences);
    }

    function onOpen() {
      const current = readConsent() ?? defaultConsent();
      setAnalytics(current.analytics);
      setPreferences(current.preferences);
      setView("preferences");
      setShow(true);
    }

    window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
  }, []);

  function persist(next: Pick<ConsentPreferences, "analytics" | "preferences">) {
    writeConsent(next);
    setAnalytics(next.analytics);
    setPreferences(next.preferences);
    setShow(false);
    setView("banner");
  }

  function acceptAll() {
    persist({ analytics: true, preferences: true });
  }

  function rejectNonEssential() {
    persist({ analytics: false, preferences: false });
  }

  function saveCustom() {
    persist({ analytics, preferences });
  }

  function clearSiteData() {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // ignore
    }
    setShow(false);
    window.location.reload();
  }

  if (!show) {
    return (
      <button
        type="button"
        onClick={openCookieSettings}
        className="fixed bottom-4 left-4 z-[90] flex h-11 w-11 items-center justify-center rounded-full border border-pelagic-sand bg-white text-pelagic-navy shadow-lg transition hover:border-pelagic-accent hover:text-pelagic-accent"
        aria-label="Cookie settings"
        title="Cookie settings"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3a9 9 0 1 0 9 9 3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 21 5a9 9 0 0 0-9-2Z"
          />
          <circle cx="9" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="15.5" r="0.85" fill="currentColor" stroke="none" />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[95] p-3 sm:p-5" role="presentation">
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-pelagic-sand bg-white shadow-[0_-16px_48px_rgba(15,23,42,0.18)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="h-1 bg-gradient-to-r from-pelagic-navy via-pelagic-accent to-pelagic-light" />

        <div className="p-5 sm:p-6">
          {view === "banner" ? (
            <>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pelagic-sky text-pelagic-navy">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3a9 9 0 1 0 9 9 3.5 3.5 0 0 1-3.5-3.5A3.5 3.5 0 0 1 21 5a9 9 0 0 0-9-2Z"
                    />
                  </svg>
                </div>
                <div>
                  <p id={titleId} className="text-base font-bold text-pelagic-ink">
                    We value your privacy
                  </p>
                  <p id={descId} className="mt-2 text-sm leading-relaxed text-pelagic-steel">
                    We use essential cookies and local storage so the site works (forms, security, your
                    choices). Optional analytics help us improve — only with your consent.{" "}
                    <Link href="/cookies" className="font-semibold text-pelagic-accent underline-offset-2 hover:underline">
                      Cookie policy
                    </Link>
                    {" · "}
                    <Link href="/privacy" className="font-semibold text-pelagic-accent underline-offset-2 hover:underline">
                      Privacy
                    </Link>
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="rounded-full border border-pelagic-warm px-4 py-2.5 text-sm font-semibold text-pelagic-steel transition hover:border-pelagic-navy hover:text-pelagic-navy"
                >
                  Reject non-essential
                </button>
                <button
                  type="button"
                  onClick={() => setView("preferences")}
                  className="rounded-full border border-pelagic-navy/25 bg-pelagic-sky/60 px-4 py-2.5 text-sm font-semibold text-pelagic-navy transition hover:border-pelagic-accent"
                >
                  Customise
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="rounded-full bg-pelagic-accent px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-pelagic-light"
                >
                  Accept all
                </button>
              </div>
            </>
          ) : (
            <>
              <p id={titleId} className="text-base font-bold text-pelagic-ink">
                Cookie preferences
              </p>
              <p id={descId} className="mt-2 text-sm leading-relaxed text-pelagic-steel">
                Choose what we may store. Essential items cannot be turned off. You can change this anytime
                from the footer or the cookie button.
              </p>

              <ul className="mt-5 space-y-3">
                <li className="flex items-start justify-between gap-4 rounded-xl border border-pelagic-sand bg-pelagic-cream/40 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-pelagic-ink">Essential</p>
                    <p className="mt-1 text-xs leading-5 text-pelagic-steel">
                      Security, form protection, consent memory, and core site function. Always on.
                    </p>
                  </div>
                  <Toggle id="consent-essential" checked disabled label="Essential cookies always on" />
                </li>
                <li className="flex items-start justify-between gap-4 rounded-xl border border-pelagic-sand px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-pelagic-ink">Preferences</p>
                    <p className="mt-1 text-xs leading-5 text-pelagic-steel">
                      Remember UI choices such as splash preference and display settings.
                    </p>
                  </div>
                  <Toggle
                    id="consent-preferences"
                    checked={preferences}
                    onChange={setPreferences}
                    label="Preferences cookies"
                  />
                </li>
                <li className="flex items-start justify-between gap-4 rounded-xl border border-pelagic-sand px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-pelagic-ink">Analytics</p>
                    <p className="mt-1 text-xs leading-5 text-pelagic-steel">
                      Anonymous usage stats to improve the site. Off until you opt in. No sale of data.
                    </p>
                  </div>
                  <Toggle
                    id="consent-analytics"
                    checked={analytics}
                    onChange={setAnalytics}
                    label="Analytics cookies"
                  />
                </li>
              </ul>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <button
                  type="button"
                  onClick={clearSiteData}
                  className="rounded-full border border-pelagic-warm px-4 py-2.5 text-sm font-semibold text-pelagic-steel transition hover:border-pelagic-accent sm:mr-auto"
                >
                  Clear site cache
                </button>
                <button
                  type="button"
                  onClick={() => setView("banner")}
                  className="rounded-full border border-pelagic-warm px-4 py-2.5 text-sm font-semibold text-pelagic-steel transition hover:border-pelagic-navy"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={saveCustom}
                  className="rounded-full bg-pelagic-accent px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-pelagic-light"
                >
                  Save preferences
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
