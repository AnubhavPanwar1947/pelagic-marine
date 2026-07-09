import { createClient, SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | null = null;
let serverClientKey: string | null = null;

function isLegacyJwtKey(key: string) {
  return key.startsWith("eyJ");
}

/**
 * Server-only Supabase client.
 * Prefers the service/secret key so contact inserts persist reliably.
 * Falls back to the anon/publishable key when the secret is not configured.
 */
export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const key = serviceRole || anonKey;

  if (!url || !key) {
    return null;
  }

  if (!serverClient || serverClientKey !== key) {
    // New sb_secret_ / sb_publishable_ keys are not JWTs. Do not put them in
    // Authorization: Bearer — only apikey. Legacy eyJ... keys keep Bearer.
    const globalHeaders = isLegacyJwtKey(key)
      ? { Authorization: `Bearer ${key}` }
      : {};

    serverClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: globalHeaders,
      },
    });
    serverClientKey = key;
  }

  return serverClient;
}

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
