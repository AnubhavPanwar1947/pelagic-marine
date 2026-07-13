/**
 * Cookie / storage consent — peer CMP pattern (Accept / Reject / Customize).
 * Analytics scripts must check hasAnalyticsConsent() before loading.
 */

export const CONSENT_STORAGE_KEY = "pelagic-cookie-consent-v3";
export const CONSENT_OPEN_EVENT = "pelagic-open-cookie-settings";
export const CONSENT_VERSION = 3;

export type ConsentPreferences = {
  version: number;
  essential: true;
  analytics: boolean;
  preferences: boolean;
  updatedAt: string;
};

export const defaultConsent = (): ConsentPreferences => ({
  version: CONSENT_VERSION,
  essential: true,
  analytics: false,
  preferences: false,
  updatedAt: new Date().toISOString(),
});

export function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentPreferences;
    if (!parsed || parsed.version !== CONSENT_VERSION) return null;
    return {
      version: CONSENT_VERSION,
      essential: true,
      analytics: Boolean(parsed.analytics),
      preferences: Boolean(parsed.preferences),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(prefs: Omit<ConsentPreferences, "version" | "essential" | "updatedAt">) {
  const value: ConsentPreferences = {
    version: CONSENT_VERSION,
    essential: true,
    analytics: prefs.analytics,
    preferences: prefs.preferences,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("pelagic-consent-updated", { detail: value }));
  return value;
}

export function hasAnalyticsConsent() {
  return readConsent()?.analytics === true;
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
