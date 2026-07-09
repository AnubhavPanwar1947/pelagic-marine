import { NextResponse } from "next/server";
import { BACKEND_PROVIDER } from "@/lib/api/config";
import { getSupabaseServerDiagnostics } from "@/lib/supabase/server";

/** Safe diagnostics — no secrets. Use to verify Vercel ↔ Supabase wiring. */
export async function GET() {
  const diagnostics = getSupabaseServerDiagnostics();

  return NextResponse.json({
    ok: diagnostics.hasUrl && (diagnostics.hasServiceRole || diagnostics.hasAnonKey),
    provider: BACKEND_PROVIDER,
    ...diagnostics,
  });
}
