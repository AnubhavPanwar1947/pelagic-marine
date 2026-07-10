"use client";

import { useContactEnquiry, urgencyOptions } from "@/components/contact/ContactEnquiryContext";
import { ContactPanelShell } from "@/components/contact/ContactPanelShell";
import { company, contactPage, serviceCategories } from "@/lib/site-data";

const fieldClass =
  "mt-1.5 w-full rounded-lg border border-pelagic-warm bg-white px-4 py-3 text-sm text-pelagic-charcoal outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/15";

function fieldHighlight(active: boolean) {
  return active ? "border-pelagic-gold ring-2 ring-pelagic-gold/25" : "";
}

export function ContactEnquiryForm() {
  const {
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
    highlightFields,
    submitted,
    reference,
    submissionSummary,
    confirmationEmailSent,
    loading,
    error,
    handleSubmit,
    resetSubmission,
    formRef,
  } = useContactEnquiry();

  if (submitted) {
    const isUrgent =
      submissionSummary?.urgency.includes("Urgent") ||
      submissionSummary?.urgency.includes("Priority");

    return (
      <ContactPanelShell>
        <div className="flex flex-1 flex-col p-8 text-center sm:text-left">
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
            {confirmationEmailSent ? "A confirmation email with your enquiry summary has been sent. " : null}
            {contactPage.sla.standard}. {contactPage.sla.avgLabel}: {contactPage.sla.avgValue}.
          </p>

          {submissionSummary && (
            <div className="mt-5 rounded-xl border border-pelagic-sand bg-pelagic-cream/60 p-4 text-left text-sm">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-pelagic-gold">
                Your enquiry summary
              </p>
              <dl className="mt-3 space-y-2 text-pelagic-charcoal">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Subject</dt>
                  <dd>{submissionSummary.subject}</dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Office</dt>
                  <dd>{submissionSummary.office}</dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Service</dt>
                  <dd>{submissionSummary.service}</dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Urgency</dt>
                  <dd>{submissionSummary.urgency}</dd>
                </div>
                {submissionSummary.vessel && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Vessel</dt>
                    <dd>{submissionSummary.vessel}</dd>
                  </div>
                )}
                {submissionSummary.port && (
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                    <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Port</dt>
                    <dd>{submissionSummary.port}</dd>
                  </div>
                )}
                <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
                  <dt className="w-32 shrink-0 font-semibold text-pelagic-steel">Email</dt>
                  <dd>{submissionSummary.email}</dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-5 rounded-xl border border-pelagic-sand bg-white p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-pelagic-gold">What happens next</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-pelagic-steel">
              {contactPage.expectations.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          {isUrgent && (
            <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-950">
              Time-critical matter: call India or UAE now — do not rely on email alone for casualty or
              vessel-alongside attendance.
            </p>
          )}

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
            onClick={resetSubmission}
            className="mt-6 text-sm font-semibold text-pelagic-accent underline-offset-4 hover:underline"
          >
            Submit another enquiry
          </button>
        </div>
      </ContactPanelShell>
    );
  }

  return (
    <>
      <ContactPanelShell>
        <div className="flex flex-1 flex-col p-6 pb-24 sm:p-8 md:pb-8">
          <form ref={formRef} className="relative flex flex-1 flex-col space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="pointer-events-none absolute h-0 w-0 opacity-0"
              aria-hidden
            />

            <div
              className={`rounded-xl border border-pelagic-gold/20 bg-pelagic-cream/40 p-4 transition ${
                highlightFields ? "ring-2 ring-pelagic-gold/20" : ""
              }`}
            >
              <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold">Operational details</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="subject">
                    Enquiry subject <span className="text-pelagic-gold">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className={fieldClass}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  >
                    {contactPage.form.subjects.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="preferredOffice">
                    Preferred office
                  </label>
                  <select
                    id="preferredOffice"
                    name="preferredOffice"
                    className={fieldClass}
                    value={preferredOffice}
                    onChange={(e) => setPreferredOffice(e.target.value)}
                  >
                    {contactPage.form.offices.map((office) => (
                      <option key={office.value} value={office.value}>
                        {office.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="vessel">
                    Vessel / project <span className="text-pelagic-gold">*</span>
                  </label>
                  <input
                    id="vessel"
                    name="vessel"
                    required
                    className={`${fieldClass} ${fieldHighlight(highlightFields)}`}
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
                    Port / location <span className="text-pelagic-gold">*</span>
                  </label>
                  <input
                    id="port"
                    name="port"
                    required
                    className={`${fieldClass} ${fieldHighlight(highlightFields)}`}
                    placeholder="Port, anchorage, or yard"
                  />
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="service">
                    Service required <span className="text-pelagic-gold">*</span>
                  </label>
                  <select
                    id="service"
                    name="service"
                    className={`${fieldClass} ${fieldHighlight(highlightFields)}`}
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
                    Urgency <span className="text-pelagic-gold">*</span>
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    required
                    className={`${fieldClass} ${fieldHighlight(highlightFields)}`}
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
                  Full name <span className="text-pelagic-gold">*</span>
                </label>
                <input id="name" name="name" required className={fieldClass} placeholder="Your name" />
              </div>
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="company">
                  Company
                </label>
                <input id="company" name="company" className={fieldClass} placeholder="Ship owner / manager" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-pelagic-charcoal" htmlFor="email">
                  Work email <span className="text-pelagic-gold">*</span>
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
                Scope & details <span className="text-pelagic-gold">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${fieldClass} ${fieldHighlight(highlightFields)}`}
                placeholder="Survey type, cargo, equipment, casualty details, or deliverables required..."
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">{error}</p>
            )}

            <label className="flex items-start gap-3 rounded-xl border border-pelagic-mist bg-pelagic-cream/30 px-4 py-3 text-sm text-pelagic-charcoal">
              <input
                type="checkbox"
                name="privacy"
                checked={privacyAccepted}
                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-pelagic-warm text-pelagic-gold focus:ring-pelagic-gold/20"
                required
              />
              <span>
                {contactPage.form.privacyConsent} <span className="text-pelagic-gold">*</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !privacyAccepted}
              className="hidden w-full rounded-lg bg-pelagic-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-pelagic-gold-light disabled:cursor-not-allowed disabled:opacity-60 md:inline-flex md:justify-center"
            >
              {loading ? "Submitting..." : "Submit enquiry"}
            </button>

            <p className="hidden text-center text-xs leading-5 text-pelagic-slate md:block">
              {contactPage.form.privacyNotice}
            </p>
          </form>
        </div>
      </ContactPanelShell>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pelagic-sand/80 bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md md:hidden">
        <button
          type="button"
          disabled={loading || !privacyAccepted}
          onClick={() => formRef.current?.requestSubmit()}
          className="w-full rounded-lg bg-pelagic-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-pelagic-gold-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit enquiry"}
        </button>
        <p className="mt-2 text-center text-xs leading-5 text-pelagic-slate">{contactPage.form.privacyNotice}</p>
      </div>
    </>
  );
}
