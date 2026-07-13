/**
 * Verify Cloudflare Turnstile tokens server-side.
 * If TURNSTILE_SECRET_KEY is not set, verification is skipped (local/dev).
 */

export async function verifyTurnstileToken(
  token: string | undefined,
  ip?: string
): Promise<{ ok: true } | { ok: false; message: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

  // Not configured yet — allow submit (honeypot + rate limit still apply)
  if (!secret || !siteKey) {
    return { ok: true };
  }

  if (!token?.trim()) {
    return {
      ok: false,
      message: "Please complete the security check before submitting.",
    };
  }

  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (ip && ip !== "unknown") body.set("remoteip", ip);

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = (await response.json()) as { success?: boolean };
    if (!data.success) {
      return {
        ok: false,
        message: "Security check failed. Please refresh and try again.",
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message: "Security check temporarily unavailable. Please try again shortly.",
    };
  }
}
