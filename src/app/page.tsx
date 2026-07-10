import Link from "next/link";
import { OfficeNetworkPanel } from "@/components/contact/OfficeNetworkPanel";
import { Button } from "@/components/ui/Button";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  company,
  decarbonization,
  highlights,
  serviceCategories,
  stats,
  testimonials,
  trustBadges,
} from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — video or image, sunset sky feel */}
      <section className="relative overflow-hidden bg-sky-gradient">
        <div className="hero-shimmer pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto grid max-w-7xl lg:grid-cols-2 lg:min-h-[85vh]">
          <div className="relative z-10 flex flex-col justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-pelagic-gold shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-pelagic-accent animate-pulse" />
                India & Dubai
              </span>
              <h1 className="font-display mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-pelagic-ink sm:text-5xl lg:text-[3.25rem]">
                {company.heroHeadline}
              </h1>
              <p className="mt-5 max-w-lg text-lg font-medium leading-relaxed text-pelagic-steel">
                {company.heroSubline}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/contact" variant="primary">
                  Start a consultation
                </Button>
                <Button
                  href={`tel:${company.phones.india.replace(/\s/g, "")}`}
                  variant="outline"
                  external
                >
                  Urgent call
                </Button>
              </div>
            </div>
          </div>
          <div className="relative min-h-[300px] lg:min-h-full">
            <HeroMedia className="absolute inset-0" />
          </div>
        </div>
      </section>

      {/* 2. Trust bar */}
      <section className="border-y border-pelagic-sand bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-pelagic-steel sm:px-6 lg:px-8">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="text-pelagic-gold">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Services */}
      <section className="bg-maritime-grid py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Four practices, one engineering standard"
              description="From concept design and structural analysis to surveys, audits and clean-fuel advisory — delivered by naval architects and Master Mariners."
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceCategories.map((service, i) => (
              <Reveal key={service.slug} delay={i * 50}>
                <Link
                  href="/services"
                  className="card-premium flex h-full flex-col rounded-3xl border border-pelagic-sand bg-white p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pelagic-sky/60 text-pelagic-gold">
                    <ServiceIcon slug={service.slug} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display mt-4 text-lg font-semibold text-pelagic-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-pelagic-slate">
                    {service.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/services" className="text-sm font-bold text-pelagic-gold hover:underline">
              Explore all services →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 4. Capabilities */}
      <section className="bg-pelagic-sand py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Capabilities"
              title="The tools and methods behind the work"
              description="Licensed analysis suites and proprietary tools — applied by engineers and Master Mariners who understand both the physics and the operation."
              align="center"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Analysis & simulation suites",
                text: "ANSYS, NAPA, AutoHydro, Optimoor and SACS — applied with engineering judgement.",
              },
              {
                title: "Mooring & compatibility",
                text: "Static and dynamic mooring analysis and LNG ship-shore compatibility in Optimoor.",
              },
              {
                title: "UMISTAB-X",
                text: "Our class-approved loading and stability tool, conceived for bulk carriers.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <article className="card-premium h-full rounded-3xl border border-pelagic-warm bg-white p-6 shadow-sm">
                  <h3 className="font-display text-lg font-semibold text-pelagic-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-pelagic-slate">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/capabilities" className="text-sm font-bold text-pelagic-gold hover:underline">
              See capabilities →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 5. Clean fuels (capabilities) */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-pelagic-sand bg-white shadow-sm">
              <div className="relative aspect-[21/8]">
                <SiteImage
                  src={siteImages.decarbonization}
                  alt="Offshore wind and clean maritime energy"
                  fill
                  brandOverlay
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
              <div className="bg-gradient-to-br from-pelagic-sky/60 via-white to-pelagic-sunset/40 p-10 lg:p-14">
              <p className="text-base font-bold uppercase tracking-[0.22em] text-pelagic-accent sm:text-lg">
                Decarbonization
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-pelagic-ink sm:text-4xl">
                {decarbonization.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-pelagic-steel">{decarbonization.summary}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {decarbonization.points.slice(0, 4).map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-pelagic-steel">
                    <span className="text-pelagic-gold">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/capabilities#clean-fuel"
                className="mt-8 inline-flex rounded-full bg-pelagic-accent px-8 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
              >
                LNG bunkering & compatibility
              </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. Why Pelagic + stats */}
      <section className="border-y border-pelagic-sand bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <SectionHeading
                eyebrow="Why Pelagic"
                title="Expertise forged at sea and ashore"
                description="Master Mariners, engineers, naval architects, and maritime lawyers — practical advice, not desk theory."
              />
              <div className="mt-8 space-y-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-pelagic-sand bg-pelagic-cream p-4"
                  >
                    <h3 className="font-semibold text-pelagic-ink">{item.title}</h3>
                    <p className="mt-1 text-sm text-pelagic-slate">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-pelagic-sand shadow-sm">
                  <SiteImage
                    src={siteImages.expertise}
                    alt="Maritime surveying and port operations"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-pelagic-warm bg-pelagic-sky/30 p-5 text-center"
                  >
                    <p className="font-display text-3xl font-bold text-pelagic-gold">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs leading-snug text-pelagic-slate">{stat.label}</p>
                  </div>
                ))}
              </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="bg-gradient-to-b from-pelagic-sky/40 to-pelagic-cream py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Client voices"
              title="What people say about us"
              description="Trusted by owners, managers, and operators worldwide — impartial advice, clear reports, and responsive support."
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.author + item.company} delay={i * 80}>
                <blockquote className="card-premium flex h-full flex-col rounded-3xl border border-pelagic-sand bg-white p-8 shadow-sm">
                  <p className="font-display text-4xl leading-none text-pelagic-gold/30">&ldquo;</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-pelagic-steel sm:text-base">
                    {item.quote}
                  </p>
                  <footer className="mt-6 border-t border-pelagic-sand pt-4">
                    <p className="font-semibold text-pelagic-ink">{item.author}</p>
                    <p className="mt-0.5 text-xs text-pelagic-gold">{item.company}</p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Team */}
      <section className="bg-pelagic-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Team"
              title="Naval architects and Master Mariners"
              description="A team that has designed structure and stood on deck — so the advice you receive is grounded in both the analysis and the operation."
              align="center"
            />
          </Reveal>
          <Reveal className="mt-10 text-center">
            <Link
              href="/team"
              className="inline-flex rounded-full bg-pelagic-charcoal px-8 py-3 text-sm font-bold text-white hover:bg-pelagic-ink"
            >
              Meet the team →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* 10. Global reach + live map */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OfficeNetworkPanel
              offices={company.offices}
              variant="full"
              title="India · Dubai"
              description="Tap India to see Mumbai and Dehradun, or select Dubai for UAE directions."
            />
        </div>
      </section>

      {/* 11. CTA */}
      <section className="relative overflow-hidden py-24 text-white">
        <SiteImage
          src={siteImages.cta}
          alt=""
          fill
          brandOverlay
          className="object-cover"
          aria-hidden
          sizes="100vw"
        />
        <div className="cta-overlay absolute inset-0" />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Let&apos;s move your project forward
          </h2>
          <p className="mt-4 text-lg text-pelagic-sand">
            Naval architecture, surveys, engineering and clean-fuel advisory — from India and Dubai.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="primary">
              Get in touch
            </Button>
            <Button
              href={`tel:${company.phones.india.replace(/\s/g, "")}`}
              variant="light"
              external
            >
              Call {company.phones.india}
            </Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
