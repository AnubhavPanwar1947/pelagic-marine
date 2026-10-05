import { company } from "@/lib/site-data";

export const CONTACT_MAILTO_NOTICE =
  "Opening your email app with this enquiry prepared. Please review the message and tap Send.";

export type EnquiryMailtoFields = {
  firstName: string;
  lastName: string;
  email: string;
  service: string;
  subject: string;
  message: string;
  preferredOffice?: string;
  urgency?: string;
};

function buildEnquiryMailtoBody(fields: EnquiryMailtoFields): string {
  const fullName = [fields.firstName, fields.lastName].filter(Boolean).join(" ").trim();
  const signOffName = fullName || fields.firstName.trim();

  const lines = ["Hello Pelagic Marine Consultants,", "", "Message:", fields.message, ""];

  if (fullName) lines.push(`Name: ${fullName}`);
  if (fields.email.trim()) lines.push(`Email: ${fields.email.trim()}`);
  if (fields.service.trim()) lines.push(`Service: ${fields.service.trim()}`);
  if (fields.preferredOffice?.trim()) lines.push(`Office: ${fields.preferredOffice.trim()}`);
  if (fields.urgency?.trim()) lines.push(`Urgency: ${fields.urgency.trim()}`);

  lines.push("", "Kind regards,", signOffName);

  return lines.join("\n");
}

export function buildEnquiryMailtoUrl(fields: EnquiryMailtoFields): string {
  const subjectLine = `Website enquiry — ${fields.subject || fields.service}`;
  const body = buildEnquiryMailtoBody(fields);

  const query = [
    `subject=${encodeURIComponent(subjectLine)}`,
    `body=${encodeURIComponent(body)}`,
  ].join("&");

  return `mailto:${company.emails.info}?${query}`;
}
