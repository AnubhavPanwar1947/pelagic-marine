import { getSupabaseClient } from "@/lib/supabase/client";
import type {
  ApiResult,
  BackendProviderInterface,
  EnquiryInput,
  EnquiryRecord,
} from "../types";

export const supabaseProvider: BackendProviderInterface = {
  async submitEnquiry(input: EnquiryInput): Promise<ApiResult<EnquiryRecord>> {
    const supabase = getSupabaseClient();

    if (!supabase) {
      return {
        success: false,
        error:
          "Contact form is not configured on this server yet. Please email info@pelagic-marine.com directly.",
      };
    }

    // Pre-generate id so we don't need SELECT after INSERT (anon RLS is insert-only).
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const { error } = await supabase.from("enquiries").insert({
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
    });

    if (error) {
      const message = error.message.toLowerCase();
      console.error("[enquiry] supabase insert failed:", error.message);

      if (message.includes("permission denied") || message.includes("row-level security")) {
        return {
          success: false,
          error:
            "We could not save your enquiry right now. Please email info@pelagic-marine.com and we will respond shortly.",
        };
      }

      return {
        success: false,
        error: error.message || "Something went wrong. Please try again.",
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
