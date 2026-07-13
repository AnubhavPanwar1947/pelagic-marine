import Link from "next/link";
import { OfficeNetworkPanel } from "@/components/contact/OfficeNetworkPanel";
import { Button } from "@/components/ui/Button";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { HeroProjectsCard } from "@/components/ui/HeroProjectsCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  company,
  decarbonization,
  highlights,
  serviceCategories,
  stats,
  testimonials,
} from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — video or image, sunset sky feel */}
      <section className="relative overflow-x-hidden bg-sky-gradient">
        <div className="pointer-events-none absolute inset-0 bg-maritime-grid opacity-[0.28]" aria-hidden />
        <div className="hero-shimmer pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 lg:min-h-[68vh]">
            <div className="relative z-10 flex flex-col justify-center py-16 lg:py-20">
              <div className="animate-fade-up">
                <span className="type-eyebrow inline-flex items-center gap-2 rounded-full bg-white/85 px-4 py-1.5 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-pelagic-accent animate-pulse" />
                  India & Dubai
                </span>
                <h1 className="type-display mt-6 text-4xl leading-[1.08] text-pelagic-ink sm:text-5xl lg:text-[3.35rem]">
                  {company.heroHeadline}
                </h1>
                <p className="type-lead mt-5 max-w-lg">
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
            <div className="relative min-h-[300px] lg:min-h-0">
              <HeroMedia className="absolute inset-0" />
            </div>
          </div>
          <div className="relative z-20 mt-8 pb-10 lg:mt-6 lg:pb-12">
            <HeroProjectsCard />
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <SectionMaritime className="py-20 lg:py-24" gridOpacity={58}>
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
                  className="card-premium card-maritime flex h-full flex-col rounded-3xl border p-6 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pelagic-sky/60 text-pelagic-accent">
                    <ServiceIcon slug={service.slug} className="h-5 w-5" />
                  </div>
                  <h3 className="type-display mt-4 text-xl leading-snug text-pelagic-ink">
                    {service.title}
                  </h3>
                  <p className="type-caption mt-2 flex-1">
                    {service.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/services" className="text-sm font-semibold text-pelagic-accent hover:underline">
              Explore all services →
            </Link>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* 4. Capabilities */}
      <SectionMaritime variant="sand" className="py-20" gridOpacity={50}>
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
                <article className="card-premium card-maritime h-full rounded-3xl border p-6 shadow-sm">
                  <h3 className="type-display text-xl leading-snug text-pelagic-ink">{item.title}</h3>
                  <p className="type-caption mt-2">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8 text-center">
            <Link href="/capabilities" className="text-sm font-semibold text-pelagic-accent hover:underline">
              See capabilities →
            </Link>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* 5. Clean fuels (capabilities) */}
      <SectionMaritime variant="plain" className="py-20" gridOpacity={38}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="card-maritime overflow-hidden rounded-3xl border shadow-sm">
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
              <p className="type-eyebrow">Decarbonization</p>
              <h2 className="type-display mt-4 text-3xl text-pelagic-ink sm:text-4xl">
                {decarbonization.headline}
              </h2>
              <p className="type-lead mt-4 max-w-2xl">{decarbonization.summary}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {decarbonization.points.slice(0, 4).map((point) => (
                  <li key={point} className="type-caption flex gap-2">
                    <span className="text-pelagic-accent">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <Link
                href="/capabilities#clean-fuel"
                className="mt-8 inline-flex rounded-full bg-pelagic-accent px-8 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
              >
                LNG bunkering & compatibility
              </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* 7. Why Pelagic + stats */}
      <SectionMaritime variant="mist" className="border-y border-pelagic-sand py-20" gridOpacity={48}>
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
                    className="card-maritime rounded-2xl border p-4"
                  >
                    <h3 className="font-semibold text-pelagic-ink">{item.title}</h3>
                    <p className="type-caption mt-1">{item.description}</p>
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
                    className="card-maritime rounded-2xl border p-5 text-center"
                  >
                    <p className="type-display text-3xl text-pelagic-accent">
                      {stat.value}
                    </p>
                    <p className="type-muted mt-1 leading-snug">{stat.label}</p>
                  </div>
                ))}
              </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionMaritime>

      {/* 8. Testimonials */}
      <SectionMaritime className="py-20 lg:py-24" gridOpacity={55}>
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
                <blockquote className="card-premium card-maritime flex h-full flex-col rounded-3xl border p-8 shadow-sm">
                  <p className="type-display text-4xl leading-none text-pelagic-accent/25">&ldquo;</p>
                  <p className="type-body mt-2 flex-1 sm:text-[1.0625rem]">
                    {item.quote}
                  </p>
                  <footer className="mt-6 border-t border-pelagic-sand pt-4">
                    <p className="font-semibold text-pelagic-ink">{item.author}</p>
                    <p className="type-caption mt-0.5 text-pelagic-accent">{item.company}</p>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </SectionMaritime>

      {/* 9. Team */}
      <SectionMaritime variant="mist" className="py-20" gridOpacity={42}>
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
      </SectionMaritime>

      {/* 10. Global reach + live map */}
      <SectionMaritime variant="sand" className="py-20" gridOpacity={52}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OfficeNetworkPanel
              offices={company.offices}
              variant="full"
              title="India · Dubai"
              description="Tap India to see Mumbai and Dehradun, or select Dubai for UAE directions."
            />
        </div>
      </SectionMaritime>
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
          <h2 className="type-display text-3xl text-white sm:text-4xl">
            Let&apos;s move your project forward
          </h2>
          <p className="type-lead mt-4 text-blue-100/90">
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
