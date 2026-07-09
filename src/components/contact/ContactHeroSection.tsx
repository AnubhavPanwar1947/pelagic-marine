"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactHeroAmbience } from "@/components/contact/ContactHeroAmbience";
import { ContactSocialLinks } from "@/components/contact/ContactSocialLinks";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SiteImage } from "@/components/ui/SiteImage";
import { company, contactPage } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export function ContactHeroSection() {
  const heroImage = contactPage.hero.imageSrc || siteImages.contactHero;

  return (
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

      <div className="contact-hero-ribbon contact-hero-ribbon--casualty relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className="flex items-center gap-2.5 text-xs font-semibold text-white sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-bold uppercase tracking-wide text-emerald-300">24/7</span>
            <span className="text-white/90">Casualty & time-critical survey line</span>
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold sm:text-sm">
            <a
              href={`tel:${company.phones.india.replace(/\s/g, "")}`}
              className="text-white transition hover:text-pelagic-gold-light"
            >
              India <span className="font-bold">{company.phones.india}</span>
            </a>
            <a
              href={`tel:${company.phones.uae.replace(/\s/g, "")}`}
              className="text-white transition hover:text-pelagic-gold-light"
            >
              UAE <span className="font-bold">{company.phones.uae}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          {/* Form first on mobile for conversion */}
          <div id="enquiry-form" className="scroll-mt-28 order-1 md:order-2 md:sticky md:top-28">
            <ContactEnquiryForm />
          </div>

          <div className="card-premium order-2 flex min-h-full flex-col rounded-3xl border border-pelagic-sand bg-white/95 p-6 shadow-md sm:p-7 md:order-1">
            <div className="border-b border-pelagic-gold/20 pb-6">
              <BrandLogo variant="promo" linked={false} />
            </div>

            <div className="mt-6 flex flex-1 flex-col">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-pelagic-gold">
                {contactPage.hero.eyebrow}
              </p>
              <h1 className="font-display mt-2 text-2xl font-bold leading-tight text-pelagic-ink sm:text-3xl lg:text-[2.35rem] lg:leading-[1.12]">
                {contactPage.hero.headline}
              </h1>
              <p className="mt-4 text-sm leading-7 text-pelagic-charcoal sm:text-base sm:leading-8">
                From pre-purchase surveys to casualty response — master mariners, naval architects,
                and maritime counsel ready when the clock is against you.
              </p>

              <div className="mt-6 flex-1">
                <div className="contact-brand-showcase relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-3xl px-7 py-8 ring-1 ring-pelagic-gold/25 sm:min-h-[260px] sm:px-10 sm:py-9">
                  <div
                    className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-pelagic-gold via-amber-300 to-pelagic-gold-light"
                    aria-hidden
                  />
                  <div className="relative flex flex-1 flex-col justify-between gap-7">
                    <div className="space-y-4">
                      <p className="font-display text-xl font-semibold leading-snug text-pelagic-ink sm:text-2xl sm:leading-snug">
                        Built for owners, operators &amp; underwriters who need clarity at sea.
                      </p>
                      <p className="text-sm leading-7 text-pelagic-charcoal sm:text-base sm:leading-8">
                        We mobilise across India and the UAE for surveying, engineering, LNG
                        operations, and maritime legal — one accountable team from first call to
                        final report.
                      </p>
                      <ul className="space-y-2.5 text-sm text-pelagic-steel sm:text-[15px]">
                        <li className="flex gap-2.5">
                          <span className="mt-0.5 shrink-0 text-pelagic-gold">◆</span>
                          <span>24/7 casualty &amp; time-critical survey mobilisation</span>
                        </li>
                        <li className="flex gap-2.5">
                          <span className="mt-0.5 shrink-0 text-pelagic-gold">◆</span>
                          <span>Warranty, fleet technical &amp; LNG bunkering support</span>
                        </li>
                        <li className="flex gap-2.5">
                          <span className="mt-0.5 shrink-0 text-pelagic-gold">◆</span>
                          <span>Offices in Mumbai, Dehradun HQ &amp; Dubai</span>
                        </li>
                      </ul>
                    </div>
                    <div className="flex w-full flex-wrap items-center justify-between gap-5 border-t border-pelagic-gold/20 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pelagic-gold sm:text-sm">
                        Mumbai · Dehradun · Dubai
                      </p>
                      <ContactSocialLinks variant="hero" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-xs leading-5 text-pelagic-steel">
                <span className="font-semibold text-pelagic-charcoal">{contactPage.sla.standard}.</span>{" "}
                {contactPage.sla.urgent}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
