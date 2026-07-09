import { getSupabaseServerDiagnostics } from "@/lib/supabase/server";
import type {
  ApiResult,
  BackendProviderInterface,
  EnquiryInput,
  EnquiryRecord,
} from "../types";

function friendlyError(message: string) {
  const lower = message.toLowerCase();
  if (
    lower.includes("permission") ||
    lower.includes("row-level security") ||
    lower.includes("jwt") ||
    lower.includes("invalid api key")
  ) {
    return "We could not save your enquiry right now. Please email info@pelagic-marine.com and we will respond shortly.";
  }
  return message || "Something went wrong. Please try again.";
}

/**
 * Insert via PostgREST with only the `apikey` header.
 * Works for both legacy JWT keys and new sb_secret_ / sb_publishable_ keys.
 */
async function insertEnquiryRow(row: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const key = serviceRole || anonKey;

  if (!url || !key) {
    return {
      ok: false as const,
      error:
        "Contact form is not configured on this server yet. Please email info@pelagic-marine.com directly.",
    };
  }

  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };

  // Legacy JWT keys also accept Authorization Bearer. New sb_* keys must NOT.
  if (key.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${key}`;
  }

  const response = await fetch(`${url}/rest/v1/enquiries`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });

  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    let code: string | undefined;
    try {
      const body = (await response.json()) as {
        message?: string;
        code?: string;
        hint?: string;
      };
      detail = body.message || body.code || detail;
      code = body.code;
      if (body.hint) detail = `${detail} (${body.hint})`;
    } catch {
      // ignore parse errors
    }
    return { ok: false as const, error: detail, code, httpStatus: response.status };
  }

  return { ok: true as const };
}

export const supabaseProvider: BackendProviderInterface = {
  async submitEnquiry(input: EnquiryInput): Promise<ApiResult<EnquiryRecord>> {
    const diagnostics = getSupabaseServerDiagnostics();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const row = {
      id,
      name: input.name.trim(),
      company: input.company?.trim() || null,
      email: input.email.trim(),
      phone: input.phone?.trim() || null,
      vessel_name: input.vessel?.trim() || null,
      port: input.port?.trim() || null,
      survey_type: input.surveyType,
      message: input.message.trim(),
      status: "pending",
    };

    const result = await insertEnquiryRow(row);

    if (!result.ok) {
      console.error("[enquiry] supabase insert failed:", result.error, {
        code: "code" in result ? result.code : undefined,
        httpStatus: "httpStatus" in result ? result.httpStatus : undefined,
        serviceKeyType: diagnostics.serviceKeyType,
        projectHost: diagnostics.projectHost,
      });
      return {
        success: false,
        error: friendlyError(result.error),
        // Safe diagnostics for debugging production inserts (no secrets).
        debug: {
          code: "code" in result ? result.code : undefined,
          httpStatus: "httpStatus" in result ? result.httpStatus : undefined,
          detail: result.error,
          serviceKeyType: diagnostics.serviceKeyType,
          projectHost: diagnostics.projectHost,
        },
      };
    }

    return {
      success: true,
      data: {
        id,
        name: input.name,
        company: input.company,
        email: input.email,
        surveyType: input.surveyType,
        message: input.message,
        status: "pending",
        createdAt,
      },
    };
  },
};
