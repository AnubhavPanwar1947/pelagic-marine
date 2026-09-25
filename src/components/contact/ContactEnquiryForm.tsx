"use client";

import { useContactEnquiry } from "@/components/contact/ContactEnquiryContext";
import { contactPage } from "@/lib/site-data";

const inputClass =
  "mt-1 w-full min-w-0 rounded-lg border border-[#d7e6f0] bg-white px-4 py-3 text-base text-[#0e235e] placeholder:text-pelagic-copy/60 outline-none transition-[border-color,box-shadow] duration-300 ease-out focus:border-[#1e7fd0] focus:ring-2 focus:ring-[#1e7fd0]/15 motion-reduce:transition-none md:text-sm";

const labelClass = "text-sm font-semibold text-pelagic-ink";

function RequiredMark() {
  return <span className="font-semibold text-[#1e7fd0]"> *</span>;
}

export function ContactEnquiryForm() {
  const {
    message,
    setMessage,
    submitted,
    reference,
    loading,
    error,
    handleSubmit,
    resetSubmission,
    formRef,
  } = useContactEnquiry();
  const { form } = contactPage;

  if (submitted) {
    return (
      <div className="min-w-0 px-2 text-center sm:px-4">
        <p className="text-base leading-7 text-[#2e6b3e]">{form.successMessage}</p>
        {reference && (
          <p className="mt-3 text-sm text-pelagic-copy">
            Reference: <span className="font-mono tracking-wide">{reference}</span>
          </p>
        )}
        <button
          type="button"
          onClick={resetSubmission}
          className="mt-6 text-sm font-semibold text-[#1e7fd0] underline-offset-4 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <h2 className="type-display text-center text-[28px] font-semibold normal-case leading-tight text-pelagic-ink sm:text-[30px] lg:text-[32px]">
        {form.eyebrow}
      </h2>
      <form
        ref={formRef}
        className="mx-auto mt-8 max-w-xl min-w-0 space-y-5 sm:mt-10"
        onSubmit={handleSubmit}
      >
        <div className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
          <label>
            Company website
            <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <input type="hidden" name="service" value={form.defaultService} />
        <input type="hidden" name="subject" value={form.defaultSubject} />
        <input type="hidden" name="preferredOffice" value="auto" />
        <input type="hidden" name="urgency" value="standard" />

        <div>
          <p className={labelClass}>
            Name
            <RequiredMark />
          </p>
          <div className="mt-2 grid min-w-0 grid-cols-1 gap-4 min-[480px]:grid-cols-2">
            <div className="min-w-0">
              <label className="text-xs text-pelagic-copy-muted" htmlFor="first_name">
                First
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                className={inputClass}
              />
            </div>
            <div className="min-w-0">
              <label className="text-xs text-pelagic-copy-muted" htmlFor="last_name">
                Last
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                autoComplete="family-name"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            Email
            <RequiredMark />
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="message">
            {form.labels.message}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={inputClass}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-[#9a3b2f] ring-1 ring-red-100">
            {error}
          </p>
        )}

        <div className="flex justify-center pt-2 pb-4 sm:pb-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#0e235e] px-10 py-3 text-sm font-semibold text-white transition-colors duration-300 ease-out hover:bg-[#0a1a45] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e235e] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
          >
            {loading ? "Sending..." : form.submit}
          </button>
        </div>
      </form>
    </div>
  );
}
