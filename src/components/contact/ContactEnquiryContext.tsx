"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitEnquiry } from "@/lib/api";
import { contactPage, serviceCategories } from "@/lib/site-data";

export const urgencyOptions = [
  { value: "standard", label: "Standard — within business days" },
  { value: "priority", label: "Priority — same week mobilisation" },
  { value: "urgent", label: "Urgent — vessel alongside / casualty" },
] as const;

type SubmissionSummary = {
  name: string;
  email: string;
  service: string;
  subject: string;
  urgency: string;
  office: string;
  vessel?: string;
  port?: string;
};

type ContactEnquiryContextValue = {
  service: string;
  setService: (value: string) => void;
  subject: string;
  setSubject: (value: string) => void;
  preferredOffice: string;
  setPreferredOffice: (value: string) => void;
  urgency: string;
  setUrgency: (value: string) => void;
  message: string;
  setMessage: (value: string) => void;
  privacyAccepted: boolean;
  setPrivacyAccepted: (value: boolean) => void;
  activeIntake: string | null;
  highlightFields: boolean;
  applyQuickIntake: (id: string) => void;
  submitted: boolean;
  reference: string | null;
  submissionSummary: SubmissionSummary | null;
  confirmationEmailSent: boolean;
  confirmationEmailError: string | null;
  loading: boolean;
  error: string | null;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  resetSubmission: () => void;
  formRef: React.RefObject<HTMLFormElement | null>;
};

const ContactEnquiryContext = createContext<ContactEnquiryContextValue | null>(null);

function getOfficeLabel(value: string) {
  return contactPage.form.offices.find((office) => office.value === value)?.label ?? value;
}

export function ContactEnquiryProvider({ children }: { children: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [confirmationEmailError, setConfirmationEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState(serviceCategories[0]?.title ?? "");
  const [subject, setSubject] = useState(contactPage.form.subjects[0] ?? "");
  const [preferredOffice, setPreferredOffice] = useState("auto");
  const [urgency, setUrgency] = useState("standard");
  const [message, setMessage] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeIntake, setActiveIntake] = useState<string | null>(null);
  const [highlightFields, setHighlightFields] = useState(false);

  const applyQuickIntake = useCallback((id: string) => {
    const intake = contactPage.quickIntake.find((item) => item.id === id);
    if (!intake) return;

    setActiveIntake(id);
    setService(intake.service);
    setUrgency(intake.urgency);
    setMessage((prev) => (prev.trim() ? prev : `${intake.messageHint}\n`));
    setHighlightFields(true);
    window.setTimeout(() => setHighlightFields(false), 2400);

    if (window.matchMedia("(max-width: 767px)").matches) {
      document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      document.getElementById("vessel")?.focus({ preventScroll: true });
    }
  }, []);

  const resetDraft = useCallback(() => {
    setService(serviceCategories[0]?.title ?? "");
    setSubject(contactPage.form.subjects[0] ?? "");
    setPreferredOffice("auto");
    setUrgency("standard");
    setMessage("");
    setPrivacyAccepted(false);
    setActiveIntake(null);
    setHighlightFields(false);
    setError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      const form = event.currentTarget;
      const formData = new FormData(form);

      const vessel = String(formData.get("vessel") ?? "").trim();
      const imo = String(formData.get("imo") ?? "").trim();
      const port = String(formData.get("port") ?? "").trim();
      const phone = String(formData.get("phone") ?? "").trim();
      const urgencyValue = String(formData.get("urgency") ?? "standard");
      const subjectValue = String(formData.get("subject") ?? "").trim();
      const officeValue = String(formData.get("preferredOffice") ?? "auto");
      const messageValue = String(formData.get("message") ?? "").trim();
      const honeypot = String(formData.get("website") ?? "").trim();

      if (!privacyAccepted) {
        setLoading(false);
        setError("Please confirm you agree to be contacted about this enquiry.");
        return;
      }

      const urgencyLabel =
        urgencyOptions.find((o) => o.value === urgencyValue)?.label ?? urgencyValue;
      const officeLabel = getOfficeLabel(officeValue);
      const vesselLine = [vessel, imo ? `IMO ${imo}` : null].filter(Boolean).join(" · ");

      const composedMessage = [
        `Subject: ${subjectValue}`,
        `Preferred office: ${officeLabel}`,
        vesselLine ? `Vessel / project: ${vesselLine}` : null,
        port ? `Port / location: ${port}` : null,
        phone ? `Phone: ${phone}` : null,
        `Urgency: ${urgencyLabel}`,
        "",
        messageValue,
      ]
        .filter((line) => line !== null)
        .join("\n");

      const result = await submitEnquiry({
        name: String(formData.get("name") ?? ""),
        company: String(formData.get("company") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone,
        vessel: vesselLine || vessel,
        port,
        surveyType: String(formData.get("service") ?? ""),
        urgency: urgencyValue,
        subject: subjectValue,
        preferredOffice: officeValue,
        message: composedMessage,
        website: honeypot,
      });

      setLoading(false);

      if (result.success) {
        setSubmissionSummary({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          service: String(formData.get("service") ?? ""),
          subject: subjectValue,
          urgency: urgencyLabel,
          office: officeLabel,
          vessel: vesselLine || vessel || undefined,
          port: port || undefined,
        });
        form.reset();
        resetDraft();
        setReference(result.data?.reference ?? null);
        setConfirmationEmailSent(Boolean(result.data?.confirmationEmailSent));
        setConfirmationEmailError(result.data?.confirmationEmailError ?? null);
        setSubmitted(true);
      } else {
        setError(result.error ?? "Something went wrong. Please try again.");
      }
    },
    [privacyAccepted, resetDraft]
  );

  const resetSubmission = useCallback(() => {
    setSubmitted(false);
    setReference(null);
    setSubmissionSummary(null);
    setConfirmationEmailSent(false);
    setConfirmationEmailError(null);
    resetDraft();
  }, [resetDraft]);

  const value = useMemo(
    () => ({
      service,
      setService,
      subject,
      setSubject,
      preferredOffice,
      setPreferredOffice,
      urgency,
      setUrgency,
      message,
      setMessage,
      privacyAccepted,
      setPrivacyAccepted,
      activeIntake,
      highlightFields,
      applyQuickIntake,
      submitted,
      reference,
      submissionSummary,
      confirmationEmailSent,
      confirmationEmailError,
      loading,
      error,
      handleSubmit,
      resetSubmission,
      formRef,
    }),
    [
      service,
      subject,
      preferredOffice,
      urgency,
      message,
      privacyAccepted,
      activeIntake,
      highlightFields,
      applyQuickIntake,
      submitted,
      reference,
      submissionSummary,
      confirmationEmailSent,
      confirmationEmailError,
      loading,
      error,
      handleSubmit,
      resetSubmission,
    ]
  );

  return (
    <ContactEnquiryContext.Provider value={value}>{children}</ContactEnquiryContext.Provider>
  );
}

export function useContactEnquiry() {
  const context = useContext(ContactEnquiryContext);
  if (!context) {
    throw new Error("useContactEnquiry must be used within ContactEnquiryProvider");
  }
  return context;
}
