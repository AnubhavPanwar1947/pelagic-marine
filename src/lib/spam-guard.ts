/**
 * Contact-form spam / abuse guards for Pelagic Marine.
 * Designed for Vercel serverless — in-memory rate limits are best-effort per instance.
 */

const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_PER_WINDOW = 5;
const MIN_FILL_MS = 2500; // bots often submit instantly
const MAX_MESSAGE_LEN = 8000;
const MAX_FIELD_LEN = 200;

type RateBucket = { count: number; resetAt: number };

const rateBuckets = new Map<string, RateBucket>();

const spamPatterns = [
  /\b(viagra|cialis|crypto\s*casino|binary\s*options|seo\s*backlinks|guest\s*post)\b/i,
  /\b(click here|buy now|limited offer|earn \$\$\$)\b/i,
  /(https?:\/\/){3,}/i,
  /(\[url=|\[link=)/i,
];

function pruneBuckets(now: number) {
  for (const [key, bucket] of rateBuckets) {
    if (bucket.resetAt <= now) rateBuckets.delete(key);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  pruneBuckets(now);

  const bucket = rateBuckets.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { ok: true };
  }

  if (bucket.count >= MAX_PER_WINDOW) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true };
}

function looksLikeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) && email.length <= 120;
}

function hasTooManyLinks(text: string): boolean {
  const matches = text.match(/https?:\/\/|www\./gi);
  return (matches?.length ?? 0) > 3;
}

export type SpamCheckInput = {
  name: string;
  email: string;
  company?: string;
  message: string;
  phone?: string;
  vessel?: string;
  /** Client-side form open timestamp (ms) */
  formStartedAt?: number | string;
  /** Honeypot — must be empty */
  website?: string;
};

export type SpamCheckResult =
  | { ok: true }
  | { ok: false; reason: "honeypot" | "timing" | "validation" | "content"; message: string };

export function checkEnquirySpam(input: SpamCheckInput): SpamCheckResult {
  if (input.website?.trim()) {
    return { ok: false, reason: "honeypot", message: "Rejected." };
  }

  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!name || !email || !message) {
    return { ok: false, reason: "validation", message: "Please complete all required fields." };
  }

  if (!looksLikeEmail(email)) {
    return { ok: false, reason: "validation", message: "Please enter a valid work email address." };
  }

  if (name.length > MAX_FIELD_LEN || (input.company?.length ?? 0) > MAX_FIELD_LEN) {
    return { ok: false, reason: "validation", message: "One or more fields are too long." };
  }

  if (message.length < 12) {
    return {
      ok: false,
      reason: "validation",
      message: "Please add a short description of your enquiry (at least a sentence).",
    };
  }

  if (message.length > MAX_MESSAGE_LEN) {
    return { ok: false, reason: "validation", message: "Your message is too long. Please shorten it." };
  }

  const startedRaw = input.formStartedAt;
  const startedAt =
    typeof startedRaw === "number"
      ? startedRaw
      : typeof startedRaw === "string" && startedRaw
        ? Number(startedRaw)
        : NaN;

  if (Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS) {
      return {
        ok: false,
        reason: "timing",
        message: "Please take a moment to complete the form before submitting.",
      };
    }
    // Reject absurd future/past timestamps (tampering)
    if (elapsed > 24 * 60 * 60 * 1000 || elapsed < 0) {
      return {
        ok: false,
        reason: "timing",
        message: "Your form session expired. Please refresh and try again.",
      };
    }
  }

  const blob = [name, email, input.company, message, input.phone, input.vessel]
    .filter(Boolean)
    .join("\n");

  if (spamPatterns.some((re) => re.test(blob))) {
    return {
      ok: false,
      reason: "content",
      message: "We could not accept this enquiry. Please email info@pelagic-marine.com directly.",
    };
  }

  if (hasTooManyLinks(message)) {
    return {
      ok: false,
      reason: "content",
      message: "Please reduce the number of links in your message and try again.",
    };
  }

  // Repeated identical characters / keyboard smash
  if (/(.)\1{12,}/.test(message) || /^[^a-zA-Z]*$/.test(message.replace(/\s/g, ""))) {
    return {
      ok: false,
      reason: "content",
      message: "Please write a clearer message describing your vessel or project.",
    };
  }

  return { ok: true };
}
