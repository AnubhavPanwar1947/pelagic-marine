/**
 * Contact enquiry client — posts to DreamHost PHP mailer (no Node/API routes).
 */

export type EnquirySubmitResult = {
  success: boolean;
  error?: string;
  data?: {
    reference?: string;
    confirmationEmailSent?: boolean;
    confirmationEmailError?: string | null;
  };
};

export async function submitEnquiryForm(
  formData: FormData
): Promise<EnquirySubmitResult> {
  const response = await fetch("/send-mail.php", {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  });

  const result = (await response.json().catch(() => null)) as {
    ok?: boolean;
    success?: boolean;
    error?: string | null;
    message?: string;
    data?: EnquirySubmitResult["data"];
  } | null;

  const ok = Boolean(result?.ok ?? result?.success) && response.ok;

  if (!ok) {
    return {
      success: false,
      error:
        result?.error ||
        result?.message ||
        "We couldn’t send your enquiry right now. Please email info@pelagic-marine.com.",
    };
  }

  return {
    success: true,
    data: result?.data,
  };
}
