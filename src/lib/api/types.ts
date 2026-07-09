export interface EnquiryInput {
  name: string;
  company: string;
  email: string;
  phone?: string;
  vessel?: string;
  port?: string;
  surveyType: string;
  urgency?: string;
  message: string;
  /** Honeypot — must stay empty */
  website?: string;
}

export interface EnquiryRecord extends EnquiryInput {
  id: string;
  status: string;
  createdAt: string;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface BackendProviderInterface {
  submitEnquiry(input: EnquiryInput): Promise<ApiResult<EnquiryRecord>>;
}
