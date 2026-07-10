"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactEnquiryProvider } from "@/components/contact/ContactEnquiryContext";
import { ContactHeroAmbience } from "@/components/contact/ContactHeroAmbience";
import { ContactIntentPaths } from "@/components/contact/ContactIntentPaths";
import { ContactTrustPanel } from "@/components/contact/ContactTrustPanel";
import { SiteImage } from "@/components/ui/SiteImage";
import { contactPage } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export function ContactHeroSection() {
  const heroImage = contactPage.hero.imageSrc || siteImages.contactHero;

  return (
    <ContactEnquiryProvider>
      <section className="contact-hero-body relative overflow-hidden border-b border-pelagic-gold/20">
        <div className="contact-hero-gradient absolute inset-0" aria-hidden />
        <ContactHeroAmbience />
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden>
          <SiteImage
            src={heroImage}
            alt=""
            fill
            brandOverlay
            className="object-cover"
            sizes="50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-amber-50/25 to-amber-50/75" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
          <ContactIntentPaths />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start md:gap-6 lg:gap-8">
            <div id="enquiry-form" className="order-1 flex scroll-mt-28 md:order-2">
              <ContactEnquiryForm />
            </div>

            <div className="order-2 flex md:order-1">
              <ContactTrustPanel />
            </div>
          </div>
        </div>
      </section>
    </ContactEnquiryProvider>
  );
}
