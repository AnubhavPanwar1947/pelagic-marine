import type {
  ApiResult,
  BackendProviderInterface,
  EnquiryInput,
  EnquiryRecord,
} from "../types";

export const mockProvider: BackendProviderInterface = {
  async submitEnquiry(input: EnquiryInput): Promise<ApiResult<EnquiryRecord>> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      data: {
        ...input,
        id: crypto.randomUUID(),
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    };
  },
};
