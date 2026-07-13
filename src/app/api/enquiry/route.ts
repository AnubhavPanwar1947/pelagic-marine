import { NextResponse } from "next/server";
import { mockProvider } from "@/lib/api/providers/mock";
import { supabaseProvider } from "@/lib/api/providers/supabase";
import { BACKEND_PROVIDER } from "@/lib/api/config";
import { sendEnquiryEmails } from "@/lib/email/enquiry-emails";
import { checkEnquirySpam, checkRateLimit, getClientIp } from "@/lib/spam-guard";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { EnquiryInput } from "@/lib/api/types";

function formatReference(id: string) {
  return `PMC-${id.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export async function POST(request: Request) {
  let body: EnquiryInput;

  try {
    body = (await request.json()) as EnquiryInput;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request. Please try again." },
      { status: 400 }
    );
  }

  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.ok) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many enquiries from this network. Please try again in ${Math.ceil(rate.retryAfterSec / 60)} minutes, or call our 24/7 line.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSec) },
      }
    );
  }

  const turnstile = await verifyTurnstileToken(body.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json({ success: false, error: turnstile.message }, { status: 400 });
  }

  const spam = checkEnquirySpam({
    name: body.name,
    email: body.email,
    company: body.company,
    message: body.message,
    phone: body.phone,
    vessel: body.vessel,
    formStartedAt: body.formStartedAt,
    website: body.website,
  });

  // Honeypot: pretend success so bots don't retry harder
  if (!spam.ok && spam.reason === "honeypot") {
    return NextResponse.json({
      success: true,
      data: {
        id: crypto.randomUUID(),
        reference: "PMC-ACCEPTED",
        name: body.name,
        company: body.company,
        email: body.email,
        surveyType: body.surveyType,
        message: body.message,
        status: "pending",
        createdAt: new Date().toISOString(),
        confirmationEmailSent: false,
      },
    });
  }

  if (!spam.ok) {
    return NextResponse.json({ success: false, error: spam.message }, { status: 400 });
  }

  const { name, email, message, surveyType } = body;

  if (!name?.trim() || !email?.trim() || !message?.trim() || !surveyType?.trim()) {
    return NextResponse.json(
      { success: false, error: "Please complete all required fields." },
      { status: 400 }
    );
  }

  const provider = BACKEND_PROVIDER === "supabase" ? supabaseProvider : mockProvider;
  const result = await provider.submitEnquiry(body);

  if (!result.success || !result.data) {
    return NextResponse.json(result, { status: 500 });
  }

  const reference = formatReference(result.data.id);
  const emailResult = await sendEnquiryEmails({
    reference,
    input: body,
    createdAt: result.data.createdAt,
  });

  if (emailResult.errors.length > 0) {
    console.error("[enquiry] email errors:", emailResult.errors);
  }

  return NextResponse.json({
    success: true,
    data: {
      ...result.data,
      reference,
      confirmationEmailSent: emailResult.confirmationSent,
      confirmationEmailError: emailResult.confirmationError,
    },
  });
}
