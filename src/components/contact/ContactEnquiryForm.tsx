"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useContactEnquiry } from "@/components/contact/ContactEnquiryContext";
import { contactPage } from "@/lib/site-data";

const fieldClass =
  "mt-1.5 w-full min-w-0 rounded-lg border border-[#d7e6f0] bg-[#f8fbfd] px-4 py-3 text-base text-[#0e235e] placeholder:text-[#364b5e]/60 outline-none transition-[border-color,background-color,box-shadow] duration-300 ease-out hover:border-[#c8d8e8] hover:bg-white focus:border-[#1e7fd0] focus:ring-2 focus:ring-[#1e7fd0]/15 motion-reduce:transition-none md:text-sm";

export function ContactEnquiryForm() {
  const {
    message,
    setMessage,
    privacyAccepted,
    setPrivacyAccepted,
    submitted,
    reference,
    loading,
    error,
    handleSubmit,
    resetSubmission,
    formRef,
  } = useContactEnquiry();
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const { form } = contactPage;

  useEffect(() => {
    const bar = mobileBarRef.current;
    if (!bar) return;

    const syncBarHeight = () => {
      document.documentElement.style.setProperty(
        "--contact-mobile-bar-height",
        `${bar.offsetHeight}px`,
      );
    };

    syncBarHeight();
    const observer = new ResizeObserver(syncBarHeight);
    observer.observe(bar);
    window.addEventListener("resize", syncBarHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncBarHeight);
      document.documentElement.style.removeProperty("--contact-mobile-bar-height");
    };
  }, [submitted]);

  if (submitted) {
    return (
      <div className="min-w-0 rounded-xl border border-[#d7e6f0] bg-white p-6 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none sm:p-8">
        <p className="text-base leading-7 text-[#2e6b3e]">{form.successMessage}</p>
        {reference && (
          <p className="mt-3 text-sm text-pelagic-steel">
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
    <>
      <div className="min-w-0 rounded-xl border border-[#d7e6f0] bg-white p-6 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none sm:p-8">
        <p className="type-eyebrow">{form.eyebrow}</p>
        <form ref={formRef} className="mt-5 space-y-4" onSubmit={handleSubmit}>
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
            <label className="text-sm font-semibold text-pelagic-ink" htmlFor="name">
              {form.labels.name}
            </label>
            <input id="name" name="name" type="text" required className={fieldClass} />
          </div>

          <div>
            <label className="text-sm font-semibold text-pelagic-ink" htmlFor="email">
              {form.labels.email}
            </label>
            <input id="email" name="email" type="email" required className={fieldClass} />
          </div>

          <div>
            <label className="text-sm font-semibold text-pelagic-ink" htmlFor="company">
              {form.labels.company}
            </label>
            <input id="company" name="company" type="text" className={fieldClass} />
          </div>

          <div>
            <label className="text-sm font-semibold text-pelagic-ink" htmlFor="message">
              {form.labels.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={fieldClass}
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-[#9a3b2f] ring-1 ring-red-100">
              {error}
            </p>
          )}

          <label className="flex items-start gap-3 rounded-xl border border-[#d7e6f0] bg-[#f7fbfd] px-4 py-3 text-sm text-[#364b5e] transition-[border-color,background-color] duration-300 ease-out hover:border-[#c8d8e8] hover:bg-[#f3f9fb] motion-reduce:transition-none">
            <input
              type="checkbox"
              name="privacy"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-pelagic-warm text-pelagic-accent focus:ring-pelagic-accent/20"
              required
            />
            <span>
              I agree that Pelagic Marine may contact me about this enquiry and related marine
              consultancy services. I have read the{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
              >
                Privacy policy
              </Link>
              . <span className="text-pelagic-accent">*</span>
            </span>
          </label>

          <button
            type="submit"
            disabled={loading || !privacyAccepted}
            className="hidden w-full rounded-lg bg-[#1e7fd0] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-pelagic-accent-hover active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:translate-y-0 md:inline-flex md:justify-center"
          >
            {loading ? "Sending..." : form.submit}
          </button>
        </form>
      </div>

      <div
        ref={mobileBarRef}
        className="contact-enquiry-mobile-bar fixed inset-x-0 bottom-0 z-40 border-t border-[#d7e6f0] bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 md:hidden"
      >
        <button
          type="button"
          disabled={loading || !privacyAccepted}
          onClick={() => formRef.current?.requestSubmit()}
          className="min-h-11 w-full rounded-lg bg-[#1e7fd0] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-pelagic-accent-hover active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none motion-reduce:active:translate-y-0"
        >
          {loading ? "Sending..." : form.submit}
        </button>
      </div>
    </>
  );
}
