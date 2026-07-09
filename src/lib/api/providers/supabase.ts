import { getSupabaseServerClient, getSupabaseServerDiagnostics } from "@/lib/supabase/server";
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

export const supabaseProvider: BackendProviderInterface = {
  async submitEnquiry(input: EnquiryInput): Promise<ApiResult<EnquiryRecord>> {
    const supabase = getSupabaseServerClient();
    const diagnostics = getSupabaseServerDiagnostics();

    if (!supabase) {
      return {
        success: false,
        error:
          "Contact form is not configured on this server yet. Please email info@pelagic-marine.com directly.",
      };
    }

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

    // New secret keys (sb_secret_...) are not JWTs — insert only, no SELECT.
    // Legacy service_role JWTs can confirm with SELECT.
    const canConfirmSelect = diagnostics.serviceKeyType === "legacy_service_role";

    if (canConfirmSelect) {
      const { data, error } = await supabase
        .from("enquiries")
        .insert(row)
        .select("id, created_at")
        .single();

      if (error) {
        console.error("[enquiry] supabase insert+select failed:", error.message, error.code);
        return { success: false, error: friendlyError(error.message) };
      }

      if (!data?.id) {
        return {
          success: false,
          error:
            "We could not confirm your enquiry was saved. Please email info@pelagic-marine.com.",
        };
      }

      return {
        success: true,
        data: {
          id: data.id,
          name: input.name,
          company: input.company,
          email: input.email,
          surveyType: input.surveyType,
          message: input.message,
          status: "pending",
          createdAt: data.created_at ?? createdAt,
        },
      };
    }

    const { error } = await supabase.from("enquiries").insert(row);

    if (error) {
      console.error("[enquiry] supabase insert failed:", error.message, error.code, {
        serviceKeyType: diagnostics.serviceKeyType,
        projectHost: diagnostics.projectHost,
      });
      return { success: false, error: friendlyError(error.message) };
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
