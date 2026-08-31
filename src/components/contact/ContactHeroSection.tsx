"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { ContactTrustPanel } from "@/components/contact/ContactTrustPanel";
import { Reveal } from "@/components/ui/Reveal";
import { contactPage } from "@/lib/site-data";

export function ContactHeroSection() {
  return (
    <ContactEnquiryProvider>
      <section className="border-b border-[#d7e6f0] bg-[#eaf6fc]">
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

      <section className="border-b border-[#d7e6f0] bg-[#f7fbfd] section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-8 lg:gap-12">
            <Reveal variant="text" className="min-w-0 md:order-1">
              <div id="enquiry-form" className="scroll-mt-28">
                <ContactEnquiryForm />
              </div>
            </Reveal>

            <Reveal variant="text" delay={80} className="min-w-0 md:order-2">
              <ContactTrustPanel />
            </Reveal>
          </div>
        </div>
      </section>
    </ContactEnquiryProvider>
  );
}
