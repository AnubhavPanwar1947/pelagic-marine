"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

const LOCAL_TEST_SITE_KEY = "1x00000000000000000000AA";

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ??
  (process.env.NODE_ENV === "development" ? LOCAL_TEST_SITE_KEY : "");

type TurnstileOptions = {
  sitekey: string;
  size: "invisible";
  "response-field": false;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileFieldProps = {
  onTokenChange: (token: string) => void;
};

export function TurnstileField({ onTokenChange }: TurnstileFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [verificationState, setVerificationState] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const renderWidget = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !containerRef.current || widgetIdRef.current || !window.turnstile) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      size: "invisible",
      "response-field": false,
      callback: (token) => {
        onTokenChange(token);
        setVerificationState("ready");
      },
      "expired-callback": () => {
        onTokenChange("");
        setVerificationState("loading");
      },
      "error-callback": () => {
        onTokenChange("");
        setVerificationState("error");
      },
    });
  }, [onTokenChange]);

  useEffect(() => {
    renderWidget();

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      onTokenChange("");
    };
  }, [onTokenChange, renderWidget]);

  if (!TURNSTILE_SITE_KEY) {
    return null;
  }

  return (
    <>
      <Script
        id="cloudflare-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <div
        ref={containerRef}
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
        aria-hidden="true"
      />
      <p
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {verificationState === "error"
          ? "Human verification could not be loaded."
          : "Human verification is active."}
      </p>
    </>
  );
}
