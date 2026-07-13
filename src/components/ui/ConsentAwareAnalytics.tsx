"use client";

import { useEffect } from "react";
import { hasAnalyticsConsent, readConsent } from "@/lib/consent";

/**
 * Loads optional analytics only after the visitor opts in.
 * Hook your GA / Plausible script here when keys are ready.
 */
export function ConsentAwareAnalytics() {
  useEffect(() => {
    function maybeLoad() {
      if (!hasAnalyticsConsent()) return;
      // Placeholder: when you add analytics, inject the script here once.
      // Example: loadPlausible() or loadGA4()
      if (process.env.NODE_ENV === "development") {
        console.info("[consent] Analytics allowed", readConsent());
      }
    }

    maybeLoad();
    window.addEventListener("pelagic-consent-updated", maybeLoad);
    return () => window.removeEventListener("pelagic-consent-updated", maybeLoad);
  }, []);

  return null;
}
