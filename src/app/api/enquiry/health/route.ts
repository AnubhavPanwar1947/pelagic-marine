import { NextResponse } from "next/server";
import { BACKEND_PROVIDER } from "@/lib/api/config";
import { getEnquiryNotifyEmail, isEmailConfigured } from "@/lib/email/resend";
import { getSupabaseServerDiagnostics } from "@/lib/supabase/server";

/** Safe diagnostics — no secrets. Use to verify Vercel ↔ Supabase wiring. */
export async function GET() {
  const diagnostics = getSupabaseServerDiagnostics();

  return NextResponse.json({
    ok: diagnostics.hasUrl && (diagnostics.hasServiceRole || diagnostics.hasAnonKey),
    provider: BACKEND_PROVIDER,
    hasUrl: diagnostics.hasUrl,
    hasAnonKey: diagnostics.hasAnonKey,
    hasServiceRole: diagnostics.hasServiceRole,
    serviceKeyType: diagnostics.serviceKeyType,
    projectHost: diagnostics.projectHost,
    email: {
      configured: isEmailConfigured(),
      notifyTo: getEnquiryNotifyEmail(),
    },
  });
}
