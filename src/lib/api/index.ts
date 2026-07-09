import type { ApiResult, EnquiryInput, EnquiryRecord } from "./types";

export type EnquiryRecordWithReference = EnquiryRecord & { reference?: string };

export async function submitEnquiry(
  input: EnquiryInput
): Promise<ApiResult<EnquiryRecordWithReference>> {
  const response = await fetch("/api/enquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const result = (await response.json()) as ApiResult<EnquiryRecordWithReference>;

  if (!response.ok && result.success === false) {
    return result;
  }

  return result;
}
