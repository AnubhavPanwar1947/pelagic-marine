import type { EnquiryInput } from "@/lib/api/types";
import { company } from "@/lib/site-data";
import {
  getEnquiryNotifyEmail,
  isEmailConfigured,
  sendResendEmail,
} from "@/lib/email/resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatUrgencyLabel(urgency?: string) {
  if (urgency === "urgent") return "URGENT — vessel alongside / casualty";
  if (urgency === "priority") return "Priority — same week mobilisation";
  return "Standard — within business days";
}

function isUrgent(urgency?: string) {
  return urgency === "urgent" || urgency === "priority";
}

function buildTeamEmailHtml(params: {
  reference: string;
  input: EnquiryInput;
  createdAt: string;
}) {
  const { reference, input, createdAt } = params;
  const rows = [
    ["Reference", reference],
    ["Received", new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC"],
    ["Name", input.name],
    ["Company", input.company || "—"],
    ["Email", input.email],
    ["Phone", input.phone || "—"],
    ["Service", input.surveyType],
    ["Urgency", formatUrgencyLabel(input.urgency)],
    ["Vessel / project", input.vessel || "—"],
    ["Port / location", input.port || "—"],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8dfd2;color:#6b6560;font-size:13px;width:140px;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td><td style="padding:8px 12px;border-bottom:1px solid #e8dfd2;color:#1a1614;font-size:14px;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const messageHtml = escapeHtml(input.message).replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fdfbf7;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:#c9941a;">New website enquiry</p>
    <h1 style="margin:0 0 24px;font-size:24px;color:#1a1614;">${escapeHtml(reference)}</h1>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e8dfd2;border-radius:8px;overflow:hidden;">${tableRows}</table>
    <div style="margin-top:20px;padding:16px;background:#fff;border:1px solid #e8dfd2;border-radius:8px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#c9941a;">Scope &amp; details</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1614;">${messageHtml}</p>
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#6b6560;">Reply directly to <a href="mailto:${escapeHtml(input.email)}" style="color:#0f766e;">${escapeHtml(input.email)}</a> to respond.</p>
  </div>
</body>
</html>`;
}

function buildConfirmationEmailHtml(params: {
  reference: string;
  name: string;
}) {
  const firstName = params.name.trim().split(/\s+/)[0] || "there";

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#fdfbf7;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.15em;text-transform:uppercase;color:#c9941a;">Pelagic Marine Consultants</p>
    <h1 style="margin:0 0 16px;font-size:24px;color:#1a1614;">Enquiry received</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3d3835;">Dear ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3d3835;">Thank you for contacting Pelagic Marine. Your enquiry has been logged and a consultant will review your scope shortly.</p>
    <p style="margin:0 0 24px;padding:12px 16px;background:#fff;border:1px solid #e8dfd2;border-radius:8px;font-size:14px;color:#1a1614;"><strong>Reference:</strong> ${escapeHtml(params.reference)}</p>
    <p style="margin:0 0 12px;font-size:14px;line-height:1.6;color:#3d3835;">We typically respond within one business day. For casualty or vessel-alongside attendance, please call our 24/7 line:</p>
    <p style="margin:0;font-size:14px;line-height:1.8;color:#1a1614;">
      India: <strong>${escapeHtml(company.phones.india)}</strong><br />
      UAE: <strong>${escapeHtml(company.phones.uae)}</strong>
    </p>
    <p style="margin:24px 0 0;font-size:13px;color:#6b6560;">${escapeHtml(company.legalName)}</p>
  </div>
</body>
</html>`;
}

export type EnquiryEmailResult = {
  configured: boolean;
  teamSent: boolean;
  confirmationSent: boolean;
  errors: string[];
};

export async function sendEnquiryEmails(params: {
  reference: string;
  input: EnquiryInput;
  createdAt: string;
}): Promise<EnquiryEmailResult> {
  const configured = isEmailConfigured();
  const result: EnquiryEmailResult = {
    configured,
    teamSent: false,
    confirmationSent: false,
    errors: [],
  };

  if (!configured) {
    return result;
  }

  const { reference, input, createdAt } = params;
  const urgent = isUrgent(input.urgency);
  const notifyTo = getEnquiryNotifyEmail();

  const teamSubject = urgent
    ? `[URGENT] New enquiry ${reference} — ${input.surveyType}`
    : `New enquiry ${reference} — ${input.surveyType}`;

  const teamText = [
    `New enquiry: ${reference}`,
    "",
    `Name: ${input.name}`,
    `Company: ${input.company || "—"}`,
    `Email: ${input.email}`,
    `Phone: ${input.phone || "—"}`,
    `Service: ${input.surveyType}`,
    `Urgency: ${formatUrgencyLabel(input.urgency)}`,
    `Vessel: ${input.vessel || "—"}`,
    `Port: ${input.port || "—"}`,
    "",
    input.message,
  ].join("\n");

  const teamResult = await sendResendEmail({
    to: notifyTo,
    subject: teamSubject,
    html: buildTeamEmailHtml({ reference, input, createdAt }),
    text: teamText,
    replyTo: input.email,
  });

  if (teamResult.ok) {
    result.teamSent = true;
  } else if (!teamResult.skipped) {
    result.errors.push(`Team notification: ${teamResult.error}`);
    console.error("[enquiry-email] team notification failed:", teamResult.error);
  }

  const confirmationText = [
    `Dear ${input.name.trim().split(/\s+/)[0] || "there"},`,
    "",
    "Thank you for contacting Pelagic Marine. Your enquiry has been received.",
    "",
    `Reference: ${reference}`,
    "",
    "We typically respond within one business day.",
    `For urgent attendance call India ${company.phones.india} or UAE ${company.phones.uae}.`,
    "",
    company.legalName,
  ].join("\n");

  const confirmationResult = await sendResendEmail({
    to: input.email,
    subject: `Pelagic Marine — enquiry received (${reference})`,
    html: buildConfirmationEmailHtml({ reference, name: input.name }),
    text: confirmationText,
    replyTo: company.emails.info,
  });

  if (confirmationResult.ok) {
    result.confirmationSent = true;
  } else if (!confirmationResult.skipped) {
    result.errors.push(`Confirmation: ${confirmationResult.error}`);
    console.error("[enquiry-email] confirmation failed:", confirmationResult.error);
  }

  return result;
}
