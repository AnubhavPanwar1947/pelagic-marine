"use client";

import { ContactEnquiryForm } from "@/components/contact/ContactEnquiryForm";
import { ContactSocialLinks } from "@/components/contact/ContactSocialLinks";
import { SiteImage } from "@/components/ui/SiteImage";
import { company, contactPage } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export function ContactHeroSection() {
  const quickPaths = contactPage.intentPaths.slice(0, 3);
  const heroImage = contactPage.hero.imageSrc || siteImages.contactHero;

  function scrollToForm() {
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden border-b border-pelagic-mist bg-sky-gradient">
      {/* Static photo on the right half (desktop) — no animated gradient */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block" aria-hidden>
        <SiteImage
          src={heroImage}
          alt=""
          fill
          brandOverlay
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pelagic-cream/20 to-pelagic-cream/70" />
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
          <div className="card-premium rounded-3xl border border-pelagic-sand bg-white/95 p-6 shadow-md sm:p-7">
            <div className="border-b border-pelagic-mist/80 pb-4">
              <p className="font-display text-lg font-bold text-pelagic-ink">{company.name}</p>
              <p className="mt-0.5 text-xs text-pelagic-steel">{company.legalName}</p>
              <p className="mt-2 text-sm leading-6 text-pelagic-charcoal">{company.tagline}</p>
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-pelagic-gold">
              {contactPage.hero.eyebrow}
            </p>
            <h1 className="font-display mt-2 text-2xl font-bold leading-tight text-pelagic-ink sm:text-3xl lg:text-[2.35rem] lg:leading-[1.12]">
              {contactPage.hero.headline}
            </h1>
            <p className="mt-3 text-sm leading-7 text-pelagic-charcoal sm:text-base">
              One qualified team across India and the UAE — share your vessel, port, or scope and
              we&apos;ll route you to the right consultant.
            </p>

            <div className="mt-4 rounded-2xl border border-pelagic-sand/80 bg-pelagic-cream/60 px-4 py-3 text-xs leading-5 text-pelagic-steel">
              <p className="font-semibold text-pelagic-charcoal">{contactPage.sla.standard}</p>
              <p className="mt-1">{contactPage.sla.urgent}</p>
            </div>

            <nav
              className="mt-5 flex flex-wrap items-center gap-x-1 gap-y-2 text-sm font-semibold"
              aria-label="Quick contact options"
            >
              {quickPaths.map((path, index) => {
                const isForm = "target" in path && path.target === "enquiry-form";
                const linkClass =
                  "text-pelagic-accent underline-offset-4 hover:text-pelagic-gold hover:underline";

                return (
                  <span key={path.id} className="inline-flex items-center">
                    {index > 0 && (
                      <span className="mx-2 text-pelagic-steel/50" aria-hidden>
                        ·
                      </span>
                    )}
                    {isForm ? (
                      <button type="button" onClick={scrollToForm} className={linkClass}>
                        {path.cta}
                      </button>
                    ) : (
                      <a href={"href" in path ? path.href : "#"} className={linkClass}>
                        {path.cta}
                      </a>
                    )}
                  </span>
                );
              })}
            </nav>

            <div className="mt-auto pt-5">
              <ContactSocialLinks variant="hero" />
            </div>
          </div>

          <div id="enquiry-form" className="scroll-mt-28 md:sticky md:top-28">
            <ContactEnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
