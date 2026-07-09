import { getSupabaseServerClient, getSupabaseServerDiagnostics } from "@/lib/supabase/server";
import type {
  ApiResult,
  BackendProviderInterface,
  EnquiryInput,
  EnquiryRecord,
} from "../types";

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

    // Service role can SELECT after INSERT (confirms the row). Anon is insert-only.
    if (diagnostics.hasServiceRole) {
      const { data, error } = await supabase
        .from("enquiries")
        .insert(row)
        .select("id, created_at")
        .single();

      if (error) {
        console.error("[enquiry] supabase insert failed:", error.message, error.code);
        return {
          success: false,
          error:
            error.message.toLowerCase().includes("permission") ||
            error.message.toLowerCase().includes("row-level security")
              ? "We could not save your enquiry right now. Please email info@pelagic-marine.com and we will respond shortly."
              : error.message || "Something went wrong. Please try again.",
        };
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
      console.error("[enquiry] supabase insert failed:", error.message, error.code);
      return {
        success: false,
        error:
          error.message.toLowerCase().includes("permission") ||
          error.message.toLowerCase().includes("row-level security")
            ? "We could not save your enquiry right now. Please email info@pelagic-marine.com and we will respond shortly."
            : error.message || "Something went wrong. Please try again.",
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
