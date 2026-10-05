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
  loading: boolean;
  error: string | null;
  mailtoNotice: boolean;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  formRef: React.RefObject<HTMLFormElement | null>;
};

const ContactEnquiryContext = createContext<ContactEnquiryContextValue | null>(null);

function getOfficeLabel(value: string) {
  return contactPage.form.offices.find((office) => office.value === value)?.label ?? value;
}

export function ContactEnquiryProvider({ children }: { children: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const mailtoPendingUrlRef = useRef<string | null>(null);
  const mailtoOpenScheduledRef = useRef(false);
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

  const beginMailtoEnquiry = useCallback((fields: EnquiryMailtoFields) => {
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
      mailtoOpenScheduledRef.current = false;
      setLoading(false);
    }, 500);

    return () => window.clearTimeout(timer);
  }, [mailtoNotice]);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loading || mailtoOpenScheduledRef.current) return;

      setError(null);
      setMailtoNotice(false);
      mailtoPendingUrlRef.current = null;

      const form = event.currentTarget;
      const formData = new FormData(form);

      const firstName = String(formData.get("first_name") ?? "").trim();
      const lastName = String(formData.get("last_name") ?? "").trim();
      if (!firstName) {
        setError("Please enter your first name.");
        return;
      }

      const visitorEmail = String(formData.get("email") ?? "").trim();
      const messageText = String(formData.get("message") ?? "").trim();
      const serviceValue = String(formData.get("service") ?? "").trim();
      const urgencyValue = String(formData.get("urgency") ?? "standard");
      const subjectValue = String(formData.get("subject") ?? "").trim();
      const officeValue = String(formData.get("preferredOffice") ?? "auto");
      const urgencyLabel =
        urgencyOptions.find((o) => o.value === urgencyValue)?.label ?? urgencyValue;
      const officeLabel = getOfficeLabel(officeValue);

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

      setLoading(true);
      beginMailtoEnquiry(mailtoFields);
    },
    [beginMailtoEnquiry, loading],
  );

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
      loading,
      error,
      mailtoNotice,
      handleSubmit,
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
      loading,
      error,
      mailtoNotice,
      handleSubmit,
    ],
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
