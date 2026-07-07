import { BACKEND_PROVIDER } from "./config";
import { mockProvider } from "./providers/mock";
import { supabaseProvider } from "./providers/supabase";
import type { ApiResult, EnquiryInput, EnquiryRecord } from "./types";

function getProvider() {
  return BACKEND_PROVIDER === "supabase" ? supabaseProvider : mockProvider;
}

export async function submitEnquiry(
  input: EnquiryInput
): Promise<ApiResult<EnquiryRecord>> {
  return getProvider().submitEnquiry(input);
}

export type { ApiResult, EnquiryInput, EnquiryRecord };
