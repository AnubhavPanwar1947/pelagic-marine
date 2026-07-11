type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; skipped?: boolean; error: string };

function getFromAddress() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Pelagic Marine <onboarding@resend.dev>"
  );
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function getEnquiryNotifyEmail() {
  return (
    process.env.ENQUIRY_NOTIFY_EMAIL?.trim() ||
    process.env.NOTIFY_EMAIL?.trim() ||
    "info@pelagic-marine.com"
  );
}

/** True when Resend is in sandbox — can only deliver to the account owner email. */
export function isResendSandboxFrom() {
  const from = getFromAddress().toLowerCase();
  return from.includes("@resend.dev") || from.includes("onboarding@");
}

export function normalizeRecipientEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidRecipientEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeRecipientEmail(email));
}

export async function sendResendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    return { ok: false, skipped: true, error: "RESEND_API_KEY not configured" };
  }

  const to = Array.isArray(params.to)
    ? params.to.map(normalizeRecipientEmail)
    : normalizeRecipientEmail(params.to);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      reply_to: params.replyTo,
    }),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string };
      detail = body.message || detail;
    } catch {
      // ignore
    }
    return { ok: false, error: detail };
  }

  try {
    const body = (await response.json()) as { id?: string };
    return { ok: true, id: body.id };
  } catch {
    return { ok: true };
  }
}
