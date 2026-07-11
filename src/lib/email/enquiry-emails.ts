import type { EnquiryInput } from "@/lib/api/types";
import { company, contactPage } from "@/lib/site-data";
import {
  getEnquiryNotifyEmail,
  isEmailConfigured,
  isResendSandboxFrom,
  isValidRecipientEmail,
  sendResendEmail,
} from "@/lib/email/resend";

const BRAND = {
  accent: "#266aae",
  navy: "#14306e",
  blue: "#4b9fd9",
  ink: "#14306e",
  steel: "#4a5f7a",
  sand: "#d4e5f5",
  cream: "#ffffff",
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.VERCEL_URL?.trim()?.replace(/^/, "https://") ||
    "https://pelagic-marine.vercel.app"
  );
}

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

function getOfficeLabel(value?: string) {
  if (!value) return "—";
  return contactPage.form.offices.find((office) => office.value === value)?.label ?? value;
}

function buildSummaryRows(input: EnquiryInput, reference: string): [string, string][] {
  return [
    ["Reference", reference],
    ["Subject", input.subject || "—"],
    ["Service", input.surveyType],
    ["Preferred office", getOfficeLabel(input.preferredOffice)],
    ["Urgency", formatUrgencyLabel(input.urgency)],
    ["Name", input.name],
    ["Company", input.company || "—"],
    ["Email", input.email],
    ["Phone", input.phone || "—"],
    ["Vessel / project", input.vessel || "—"],
    ["Port / location", input.port || "—"],
  ];
}

function buildSummaryTableHtml(rows: [string, string][]) {
  return rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.sand};color:${BRAND.steel};font-size:13px;width:148px;vertical-align:top;"><strong>${escapeHtml(label)}</strong></td>
          <td style="padding:10px 14px;border-bottom:1px solid ${BRAND.sand};color:${BRAND.ink};font-size:14px;line-height:1.5;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

function buildEmailShell(params: {
  eyebrow: string;
  title: string;
  bodyHtml: string;
  footerNote?: string;
}) {
  const siteUrl = getSiteUrl();
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${BRAND.cream};font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px 16px 40px;">
    <div style="height:4px;border-radius:4px;background:linear-gradient(90deg,${BRAND.navy},${BRAND.blue});margin-bottom:24px;"></div>
    <p style="margin:0 0 6px;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.accent};">${escapeHtml(params.eyebrow)}</p>
    <h1 style="margin:0 0 20px;font-size:22px;line-height:1.3;color:${BRAND.ink};">${escapeHtml(params.title)}</h1>
    ${params.bodyHtml}
    <div style="margin-top:28px;padding-top:20px;border-top:1px solid ${BRAND.sand};">
      <p style="margin:0 0 6px;font-size:13px;color:${BRAND.ink};font-weight:bold;">${escapeHtml(company.legalName)}</p>
      <p style="margin:0;font-size:12px;line-height:1.7;color:${BRAND.steel};">
        <a href="mailto:${escapeHtml(company.emails.info)}" style="color:${BRAND.blue};text-decoration:none;">${escapeHtml(company.emails.info)}</a>
        &nbsp;·&nbsp;
        <a href="${escapeHtml(siteUrl)}/contact" style="color:${BRAND.blue};text-decoration:none;">Contact page</a>
      </p>
      ${params.footerNote ? `<p style="margin:10px 0 0;font-size:11px;color:${BRAND.steel};">${escapeHtml(params.footerNote)}</p>` : ""}
    </div>
  </div>
</body>
</html>`;
}

function buildNextStepsHtml() {
  const items = contactPage.expectations
    .map(
      (step, index) =>
        `<li style="margin:0 0 10px;font-size:14px;line-height:1.55;color:#3d3835;">${index + 1}. ${escapeHtml(step)}</li>`
    )
    .join("");

  return `<div style="margin:20px 0 0;padding:16px 18px;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;">
    <p style="margin:0 0 10px;font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.accent};">What happens next</p>
    <ol style="margin:0;padding-left:18px;">${items}</ol>
  </div>`;
}

function buildUrgentBannerHtml() {
  return `<div style="margin:16px 0;padding:14px 16px;background:#fff7ed;border:1px solid #fcd34d;border-radius:8px;">
    <p style="margin:0 0 8px;font-size:12px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:#b45309;">Time-critical matter</p>
    <p style="margin:0;font-size:14px;line-height:1.55;color:#3d3835;">For casualty or vessel-alongside attendance, call India or UAE directly — do not wait for email alone.</p>
    <p style="margin:10px 0 0;font-size:14px;line-height:1.8;color:${BRAND.ink};">
      India: <strong>${escapeHtml(company.phones.india)}</strong><br />
      UAE: <strong>${escapeHtml(company.phones.uae)}</strong>
    </p>
  </div>`;
}

function buildTeamEmailHtml(params: {
  reference: string;
  input: EnquiryInput;
  createdAt: string;
}) {
  const { reference, input, createdAt } = params;
  const urgent = isUrgent(input.urgency);
  const rows: [string, string][] = [
    ["Received", new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC"],
    ...buildSummaryRows(input, reference),
  ];

  const messageHtml = escapeHtml(input.message).replace(/\n/g, "<br />");
  const replyHref = `mailto:${encodeURIComponent(input.email)}?subject=${encodeURIComponent(`Re: ${reference} — ${input.surveyType}`)}`;

  const bodyHtml = `
    ${urgent ? `<div style="margin:0 0 16px;padding:12px 16px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;">
      <p style="margin:0;font-size:13px;font-weight:bold;color:#b91c1c;">⚠ Priority enquiry — respond immediately</p>
    </div>` : ""}
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#3d3835;">A new website enquiry has been submitted. Review scope below and reply to the client.</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;overflow:hidden;">${buildSummaryTableHtml(rows)}</table>
    <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;">
      <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.accent};">Scope &amp; details</p>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.ink};">${messageHtml}</p>
    </div>
    <div style="margin-top:20px;text-align:center;">
      <a href="${replyHref}" style="display:inline-block;padding:12px 22px;background:${BRAND.navy};color:#fff;font-size:14px;font-weight:bold;text-decoration:none;border-radius:6px;">Reply to ${escapeHtml(input.name)}</a>
    </div>
    <p style="margin:16px 0 0;font-size:13px;color:${BRAND.steel};text-align:center;">Client email: <a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND.blue};">${escapeHtml(input.email)}</a></p>`;

  return buildEmailShell({
    eyebrow: urgent ? "Urgent website enquiry" : "New website enquiry",
    title: reference,
    bodyHtml,
  });
}

function buildConfirmationEmailHtml(params: {
  reference: string;
  input: EnquiryInput;
}) {
  const { reference, input } = params;
  const firstName = input.name.trim().split(/\s+/)[0] || "there";
  const urgent = isUrgent(input.urgency);
  const rows = buildSummaryRows(input, reference);

  const bodyHtml = `
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3d3835;">Dear ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#3d3835;">Thank you for contacting Pelagic Marine. We have received your enquiry and logged it under the reference below.</p>
    <p style="margin:0 0 16px;padding:12px 16px;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;font-size:14px;color:${BRAND.ink};">
      <strong>${escapeHtml(contactPage.sla.standard)}.</strong> ${escapeHtml(contactPage.sla.avgLabel)}: ${escapeHtml(contactPage.sla.avgValue)}.
    </p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;overflow:hidden;">
      <tr>
        <td colspan="2" style="padding:10px 14px;background:#f8faf9;font-size:11px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.accent};">Your enquiry summary</td>
      </tr>
      ${buildSummaryTableHtml(rows)}
    </table>
    ${buildNextStepsHtml()}
    ${urgent ? buildUrgentBannerHtml() : `<div style="margin:20px 0 0;padding:14px 16px;background:#fff;border:1px solid ${BRAND.sand};border-radius:8px;">
      <p style="margin:0 0 8px;font-size:12px;font-weight:bold;color:${BRAND.ink};">Need faster routing?</p>
      <p style="margin:0;font-size:14px;line-height:1.7;color:#3d3835;">
        India: <strong>${escapeHtml(company.phones.india)}</strong><br />
        UAE: <strong>${escapeHtml(company.phones.uae)}</strong>
      </p>
    </div>`}
    <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:${BRAND.steel};">Keep this email for your records. If your scope changes, reply with your reference <strong>${escapeHtml(reference)}</strong>.</p>`;

  return buildEmailShell({
    eyebrow: company.legalName,
    title: `Enquiry received — ${reference}`,
    bodyHtml,
    footerNote: "This is an automated confirmation. A consultant will follow up personally.",
  });
}

export type EnquiryEmailResult = {
  configured: boolean;
  teamSent: boolean;
  confirmationSent: boolean;
  confirmationError?: string;
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
  const recipientEmail = input.email.trim();

  if (!isValidRecipientEmail(recipientEmail)) {
    result.confirmationError = "Invalid email address for confirmation.";
    result.errors.push(result.confirmationError);
  }

  const urgent = isUrgent(input.urgency);
  const notifyTo = getEnquiryNotifyEmail();

  const teamSubject = urgent
    ? `[URGENT] New enquiry ${reference} — ${input.surveyType}`
    : `New enquiry ${reference} — ${input.surveyType}`;

  const teamText = [
    `New enquiry: ${reference}`,
    `Received: ${new Date(createdAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC`,
    "",
    ...buildSummaryRows(input, reference).map(([label, value]) => `${label}: ${value}`),
    "",
    "Scope & details:",
    input.message,
    "",
    `Reply to: ${recipientEmail}`,
  ].join("\n");

  const firstName = input.name.trim().split(/\s+/)[0] || "there";
  const confirmationText = [
    `Dear ${firstName},`,
    "",
    "Thank you for contacting Pelagic Marine. Your enquiry has been received.",
    "",
    `Reference: ${reference}`,
    `Subject: ${input.subject || "—"}`,
    `Service: ${input.surveyType}`,
    `Preferred office: ${getOfficeLabel(input.preferredOffice)}`,
    `Urgency: ${formatUrgencyLabel(input.urgency)}`,
    input.vessel ? `Vessel / project: ${input.vessel}` : null,
    input.port ? `Port / location: ${input.port}` : null,
    "",
    contactPage.sla.standard,
    "",
    "What happens next:",
    ...contactPage.expectations.map((step, i) => `${i + 1}. ${step}`),
    "",
    urgent
      ? `URGENT: Call India ${company.phones.india} or UAE ${company.phones.uae} now.`
      : `India: ${company.phones.india} · UAE: ${company.phones.uae}`,
    "",
    company.legalName,
    company.emails.info,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const [teamResult, confirmationResult] = await Promise.all([
    sendResendEmail({
      to: notifyTo,
      subject: teamSubject,
      html: buildTeamEmailHtml({ reference, input, createdAt }),
      text: teamText,
      replyTo: recipientEmail,
    }),
    isValidRecipientEmail(recipientEmail)
      ? sendResendEmail({
          to: recipientEmail,
          subject: `Pelagic Marine — enquiry confirmed (${reference})`,
          html: buildConfirmationEmailHtml({ reference, input }),
          text: confirmationText,
          replyTo: company.emails.info,
        })
      : Promise.resolve({ ok: false as const, error: "Invalid recipient email" }),
  ]);

  if (teamResult.ok) {
    result.teamSent = true;
  } else if (!teamResult.skipped) {
    result.errors.push(`Team notification: ${teamResult.error}`);
    console.error("[enquiry-email] team notification failed:", teamResult.error);
  }

  if (confirmationResult.ok) {
    result.confirmationSent = true;
  } else if (!("skipped" in confirmationResult && confirmationResult.skipped)) {
    const message = confirmationResult.error;
    result.confirmationError = message;
    result.errors.push(`Confirmation: ${message}`);
    console.error("[enquiry-email] confirmation failed:", message, {
      to: recipientEmail,
      sandboxFrom: isResendSandboxFrom(),
    });
  }

  return result;
}
