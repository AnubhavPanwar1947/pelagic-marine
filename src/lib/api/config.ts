export type BackendProvider = "mock" | "supabase";

const hasSupabaseConfig = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

/** Use mock only on local dev when .env.local is missing. Production always uses Supabase. */
export const BACKEND_PROVIDER: BackendProvider = hasSupabaseConfig
  ? "supabase"
  : process.env.NODE_ENV === "development"
    ? "mock"
    : "supabase";
