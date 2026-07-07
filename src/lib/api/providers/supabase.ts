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

    const { error } = await supabase.from("enquiries").insert({
      name: input.name,
      company: input.company || null,
      email: input.email,
      survey_type: input.surveyType,
      message: input.message,
      status: "pending",
    });

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("permission denied")) {
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
        id: "",
        name: input.name,
        company: input.company,
        email: input.email,
        surveyType: input.surveyType,
        message: input.message,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    };
  },
};
