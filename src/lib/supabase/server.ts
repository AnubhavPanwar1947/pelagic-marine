/**
 * Server-side Supabase diagnostics helpers.
 * Enquiry inserts use PostgREST directly (see providers/supabase.ts)
 * so new sb_secret_ keys work without JWT Authorization headers.
 */

export function getSupabaseProjectHost() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function getSupabaseServerDiagnostics() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

  return {
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    hasAnonKey: Boolean(anonKey),
    hasServiceRole: Boolean(serviceRole),
    serviceKeyType: serviceRole
      ? serviceRole.startsWith("sb_secret_")
        ? "secret"
        : serviceRole.startsWith("eyJ")
          ? "legacy_service_role"
          : "unknown"
      : null,
    projectHost: getSupabaseProjectHost(),
  };
}
