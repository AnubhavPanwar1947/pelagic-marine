"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { Reveal } from "@/components/ui/Reveal";
import { contactPage, getHubOffices, getOfficeById } from "@/lib/site-data";
import "./contact-theme.css";

const contactOffices = [
  {
    label: "India",
    bullets: getHubOffices("india").map((office) => office.address),
  },
  {
    label: "Dubai",
    bullets: [getOfficeById("dubai").address],
  },
  {
    label: "Singapore",
    bullets: [] as string[],
  },
] as const;

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactEnquiryProvider>
        <section className="contact-surface-icy border-b border-pelagic-sand">
          <div className="mx-auto max-w-7xl px-4 page-hero-py sm:px-6 lg:px-8">
            <Reveal variant="text">
              <div className="max-w-3xl min-w-0">
                <p className="type-eyebrow">{contactPage.hero.eyebrow}</p>
                <h1 className="type-display type-page-title mt-4 font-medium text-[#0e235e]">
                  {contactPage.hero.headline}
                </h1>
                <p className="type-lead mt-5 max-w-2xl font-normal text-[#364b5e]">
                  {contactPage.hero.subline}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="contact-surface-soft border-b border-pelagic-sand section-py-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal variant="text">
              <div
                id="enquiry-form"
                className="contact-enquiry-shell mx-auto max-w-2xl min-w-0 scroll-mt-28"
              >
                <ContactEnquiryForm />
              </div>
            </Reveal>
          </div>
        </section>
      </ContactEnquiryProvider>

      <section className="contact-surface-icy section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="text">
            <h2 className="type-display type-subsection-title font-medium text-[#0e235e]">
              Our offices
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-3">
            {contactOffices.map((office, index) => (
              <Reveal key={office.label} variant="card" delay={index * 80} className="h-full">
                <article className="contact-office-card group relative flex h-full min-h-[12rem] flex-col overflow-hidden rounded-xl border border-pelagic-sand bg-white px-6 py-7 motion-reduce:transition-none sm:min-h-[13.5rem] sm:px-7 sm:py-8">
                  <div className="contact-office-card-top-accent" aria-hidden />
                  <div
                    className="contact-office-card-accent absolute bottom-7 left-0 top-7 w-0.5 rounded-full motion-reduce:transition-none sm:bottom-8 sm:top-8"
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col pl-5 sm:pl-6">
                    <div className="contact-office-card-header">
                      <h3 className="type-display type-card-title font-medium text-[#0e235e]">
                        {office.label}
                      </h3>
                    </div>
                    {office.bullets.length > 0 ? (
                      <ul className="mt-4 flex-1 space-y-3 text-sm leading-7 text-[#364b5e] sm:text-base">
                        {office.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span
                              className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0e235e]"
                              aria-hidden
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex-1" aria-hidden />
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
