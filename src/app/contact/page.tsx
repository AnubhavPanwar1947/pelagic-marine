"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { Reveal } from "@/components/ui/Reveal";
import { contactPage } from "@/lib/site-data";
import "./contact-theme.css";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <ContactEnquiryProvider>
        <section className="contact-surface-icy border-b border-pelagic-sand pb-12 pt-8 sm:pb-16 sm:pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal variant="text">
              <div className="mx-auto max-w-2xl min-w-0">
                <p className="type-eyebrow contact-hero-eyebrow text-center">
                  {contactPage.hero.eyebrow}
                </p>
                <div
                  id="enquiry-form"
                  className="contact-enquiry-shell mt-6 min-w-0 scroll-mt-28 sm:mt-8"
                >
                  <ContactEnquiryForm />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </ContactEnquiryProvider>
    </div>
  );
}
