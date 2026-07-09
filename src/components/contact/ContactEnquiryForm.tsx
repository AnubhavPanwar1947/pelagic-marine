"use client";

import { FormEvent, useRef, useState } from "react";
import { submitEnquiry } from "@/lib/api";
import { company, contactPage, serviceCategories } from "@/lib/site-data";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-pelagic-warm bg-white px-4 py-3 text-sm text-pelagic-charcoal outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/15";

const urgencyOptions = [
  { value: "standard", label: "Standard — within business days" },
  { value: "priority", label: "Priority — same week mobilisation" },
  { value: "urgent", label: "Urgent — vessel alongside / casualty" },
];

export function ContactEnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState(serviceCategories[0]?.title ?? "");
  const [urgency, setUrgency] = useState("standard");
  const [message, setMessage] = useState("");
  const [activeIntake, setActiveIntake] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function applyQuickIntake(id: string) {
    const intake = contactPage.quickIntake.find((item) => item.id === id);
    if (!intake) return;

    setActiveIntake(id);
    setService(intake.service);
    setUrgency(intake.urgency);
    setMessage((prev) => (prev.trim() ? prev : `${intake.messageHint}\n`));
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    const messageValue = String(formData.get("message") ?? "").trim();
    const honeypot = String(formData.get("website") ?? "").trim();

    const urgencyLabel =
      urgencyOptions.find((o) => o.value === urgencyValue)?.label ?? urgencyValue;

    const vesselLine = [vessel, imo ? `IMO ${imo}` : null].filter(Boolean).join(" · ");

    const composedMessage = [
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
      message: composedMessage,
      website: honeypot,
    });

    setLoading(false);

    if (result.success) {
      form.reset();
      setService(serviceCategories[0]?.title ?? "");
      setUrgency("standard");
      setMessage("");
      setActiveIntake(null);
      setReference(result.data?.reference ?? null);
      setSubmitted(true);
    } else {
      setError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div className="contact-card-gradient-shell contact-card-gradient-shell--medium rounded-2xl p-[2px] shadow-xl">
        <div className="contact-page-form overflow-hidden rounded-[14px] border border-white/55 bg-white/90 shadow-xl backdrop-blur-md">
          <div className="p-8 text-center sm:text-left">
            <div
              className="contact-form-success-check mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:mx-0"
              aria-hidden
            >
              <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-display mt-5 text-2xl font-semibold text-pelagic-ink">Enquiry received</p>
            {reference && (
              <p className="mt-2 text-sm font-semibold text-pelagic-gold">
                Reference: <span className="font-mono tracking-wide">{reference}</span>
              </p>
            )}
            <p className="mt-3 text-sm leading-7 text-pelagic-steel">
              We typically reply within 1 business day. For casualty or vessel-alongside attendance,
              call our 24/7 line now — a consultant will route you immediately.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <a
                href={`tel:${company.phones.india.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center rounded-lg bg-pelagic-gold px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pelagic-gold-light"
              >
                Call India {company.phones.india}
              </a>
              <a
                href={`tel:${company.phones.uae.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center rounded-lg border border-pelagic-sand bg-white px-4 py-2.5 text-sm font-semibold text-pelagic-charcoal transition hover:border-pelagic-gold"
              >
                Call UAE {company.phones.uae}
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setReference(null);
                setError(null);
              }}
              className="mt-6 text-sm font-semibold text-pelagic-accent underline-offset-4 hover:underline"
            >
              Submit another enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-card-gradient-shell contact-card-gradient-shell--medium rounded-2xl p-[2px] shadow-xl">
      <div className="contact-page-form overflow-hidden rounded-[14px] border border-white/55 bg-white/90 shadow-xl backdrop-blur-md">
        <div className="p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">Project enquiry</p>
          <h2 className="font-display mt-2 text-2xl font-semibold text-pelagic-ink">
            Request expert attendance
          </h2>
          <p className="mt-2 text-sm leading-6 text-pelagic-steel">
            Vessel, port, and urgency first — we assign the right surveyor or engineer from there.
          </p>
          <p className="mt-2 text-xs font-medium text-pelagic-charcoal">
            {contactPage.sla.standard} · Urgent cases: call the 24/7 line above
          </p>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wider text-pelagic-steel">Quick intake</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {contactPage.quickIntake.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => applyQuickIntake(item.id)}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                    activeIntake === item.id
                      ? "border-pelagic-gold bg-pelagic-gold text-white shadow-sm"
                      : "border-pelagic-mist bg-white text-pelagic-charcoal hover:border-pelagic-gold/60 hover:text-pelagic-gold"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <form ref={formRef} className="relative mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="pointer-events-none absolute h-0 w-0 opacity-0"
              aria-hidden
            />

            <div className="rounded-xl border border-pelagic-gold/20 bg-pelagic-cream/40 p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-pelagic-gold">
                Operational details
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="vessel">
                    Vessel / project
                  </label>
                  <input
                    id="vessel"
                    name="vessel"
                    required
                    className={fieldClass}
                    placeholder="Vessel name or project reference"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="imo">
                    IMO number
                  </label>
                  <input
                    id="imo"
                    name="imo"
                    className={fieldClass}
                    placeholder="e.g. 9123456"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="port">
                    Port / location
                  </label>
                  <input
                    id="port"
                    name="port"
                    required
                    className={fieldClass}
                    placeholder="Port, anchorage, or yard"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="service">
                    Service required
                  </label>
                  <select
                    id="service"
                    name="service"
                    className={fieldClass}
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    {serviceCategories.map((cat) => (
                      <option key={cat.slug} value={cat.title}>
                        {cat.title}
                      </option>
                    ))}
                    <option>Other / not sure</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="urgency">
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    required
                    className={fieldClass}
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                  >
                    {urgencyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="name">
                  Full name
                </label>
                <input id="name" name="name" required className={fieldClass} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="company">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  className={fieldClass}
                  placeholder="Ship owner / manager"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="email">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={fieldClass}
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={fieldClass}
                  placeholder="+91 or +971 number"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="message">
                Scope & details
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={fieldClass}
                placeholder="Survey type, cargo, equipment, casualty details, or deliverables required..."
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-pelagic-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-pelagic-gold-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit enquiry"}
            </button>
          </form>

          <ul className="mt-6 space-y-2 border-t border-pelagic-mist pt-5">
            {contactPage.expectations.map((item) => (
              <li key={item} className="flex gap-2 text-xs leading-5 text-pelagic-steel">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pelagic-accent" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
