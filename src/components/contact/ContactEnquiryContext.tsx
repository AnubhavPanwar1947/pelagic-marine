"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitEnquiryForm } from "@/lib/api";
import {
  buildEnquiryMailtoUrl,
  type EnquiryMailtoFields,
} from "@/lib/contact-mailto-fallback";
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
  mailtoNotice: boolean;
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
  const formStartedAtRef = useRef<number>(Date.now());
  const mailtoPendingUrlRef = useRef<string | null>(null);
  const mailtoOpenScheduledRef = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionSummary | null>(null);
  const [confirmationEmailSent, setConfirmationEmailSent] = useState(false);
  const [confirmationEmailError, setConfirmationEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mailtoNotice, setMailtoNotice] = useState(false);
  const [service, setService] = useState(serviceCategories[0]?.title ?? "");
  const [subject, setSubject] = useState(contactPage.form.subjects[0] ?? "");
  const [preferredOffice, setPreferredOffice] = useState("auto");
  const [urgency, setUrgency] = useState("standard");
  const [message, setMessage] = useState("");
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
    setActiveIntake(null);
    setHighlightFields(false);
    setError(null);
    setMailtoNotice(false);
    mailtoPendingUrlRef.current = null;
    mailtoOpenScheduledRef.current = false;
  }, []);

  const beginMailtoFallback = useCallback((fields: EnquiryMailtoFields) => {
    if (mailtoOpenScheduledRef.current) return;
    mailtoOpenScheduledRef.current = true;
    mailtoPendingUrlRef.current = buildEnquiryMailtoUrl(fields);
    setMailtoNotice(true);
  }, []);

  useEffect(() => {
    if (!mailtoNotice || !mailtoPendingUrlRef.current) return;

    const url = mailtoPendingUrlRef.current;
    const timer = window.setTimeout(() => {
      window.location.assign(url);
      mailtoPendingUrlRef.current = null;
    }, 500);

    return () => window.clearTimeout(timer);
  }, [mailtoNotice]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loading) return;

      setLoading(true);
      setError(null);
      setMailtoNotice(false);
      mailtoPendingUrlRef.current = null;
      mailtoOpenScheduledRef.current = false;

      const form = event.currentTarget;
      const formData = new FormData(form);

      const firstName = String(formData.get("first_name") ?? "").trim();
      const lastName = String(formData.get("last_name") ?? "").trim();
      if (!firstName) {
        setLoading(false);
        setError("Please enter your first name.");
        return;
      }
      const fullName = lastName ? `${firstName} ${lastName}` : firstName;
      formData.set("name", fullName);
      formData.delete("first_name");
      formData.delete("last_name");

      const visitorEmail = String(formData.get("email") ?? "").trim();
      const messageText = String(formData.get("message") ?? "").trim();
      const serviceValue = String(formData.get("service") ?? "").trim();

      const vessel = String(formData.get("vessel") ?? "").trim();
      const imo = String(formData.get("imo") ?? "").trim();
      const port = String(formData.get("port") ?? "").trim();
      const urgencyValue = String(formData.get("urgency") ?? "standard");
      const subjectValue = String(formData.get("subject") ?? "").trim();
      const officeValue = String(formData.get("preferredOffice") ?? "auto");
      const urgencyLabel =
        urgencyOptions.find((o) => o.value === urgencyValue)?.label ?? urgencyValue;
      const officeLabel = getOfficeLabel(officeValue);
      const vesselLine = [vessel, imo ? `IMO ${imo}` : null].filter(Boolean).join(" · ");

      const mailtoFields: EnquiryMailtoFields = {
        firstName,
        lastName,
        email: visitorEmail,
        service: serviceValue,
        subject: subjectValue,
        message: messageText,
        preferredOffice: officeLabel,
        urgency: urgencyLabel,
      };

      formData.set("form_started_at", String(formStartedAtRef.current));
      formData.set("preferredOffice", officeLabel);
      formData.set("urgency", urgencyLabel);

      try {
        const result = await submitEnquiryForm(formData);
        setLoading(false);

        if (result.success) {
          setSubmissionSummary({
            name: String(formData.get("name") ?? ""),
            email: visitorEmail,
            service: serviceValue,
            subject: subjectValue,
            urgency: urgencyLabel,
            office: officeLabel,
            vessel: vesselLine || vessel || undefined,
            port: port || undefined,
          });
          form.reset();
          resetDraft();
          formStartedAtRef.current = Date.now();
          setReference(result.data?.reference ?? null);
          setConfirmationEmailSent(Boolean(result.data?.confirmationEmailSent));
          setConfirmationEmailError(result.data?.confirmationEmailError ?? null);
          setSubmitted(true);
        } else {
          beginMailtoFallback(mailtoFields);
        }
      } catch {
        setLoading(false);
        beginMailtoFallback(mailtoFields);
      }
    },
    [beginMailtoFallback, loading, resetDraft]
  );

  const resetSubmission = useCallback(() => {
    setSubmitted(false);
    setReference(null);
    setSubmissionSummary(null);
    setConfirmationEmailSent(false);
    setConfirmationEmailError(null);
    formStartedAtRef.current = Date.now();
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
      mailtoNotice,
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
      mailtoNotice,
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
