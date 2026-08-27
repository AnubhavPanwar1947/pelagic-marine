import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import {
  HeroMedia,
  HeroParallaxBackdrop,
  HeroSectionFill,
} from "@/components/ui/HeroMedia";
import { ProjectsCapabilitiesCard } from "@/components/ui/ProjectsCapabilitiesCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SiteImage } from "@/components/ui/SiteImage";
import { StatsBand } from "@/components/ui/StatsBand";
import {
  company,
  decarbonization,
  highlights,
  serviceCategories,
  stats,
} from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, siteImages } from "@/lib/site-images";

const homeServices = serviceCategories.filter((service) => service.home !== false);

export default function HomePage() {
  return (
    <>
      <HeroParallaxBackdrop />

      {/* ── Section 1 · Hero: staggered entrance on page load ── */}
      <section className="home-hero-section relative z-10 flex min-h-[100svh] min-h-[100dvh] flex-col overflow-hidden bg-[#071a33] lg:min-h-[100dvh]">
        <HeroMedia />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="home-hero-copy w-full max-w-3xl">
            <p
              className="home-hero-line home-hero-line--1 type-hero-brand font-semibold text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Pelagic Marine
            </p>
            <p className="home-hero-line home-hero-line--2 mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-pelagic-accent sm:text-xs">
              Solutions · India & Dubai
            </p>
            <h1 className="home-hero-line home-hero-line--3 type-display type-hero-title mt-8 w-full max-w-2xl text-white">
              Serving the shipping industry,{" "}
              <span className="text-heading-accent">round the clock.</span>
            </h1>
            <p className="home-hero-line home-hero-line--4 mt-5 w-full max-w-xl text-base leading-7 text-blue-50/88 sm:text-lg sm:leading-8">
              {company.heroSubline}
            </p>
            <div className="home-hero-line home-hero-line--5 mt-8 sm:mt-10">
              <Button href="/contact" variant="primary">
                Start a consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2 · Delivery: text + card ── */}
      <SectionMaritime variant="delivery" className="section-py relative z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectsCapabilitiesCard />
        </div>
      </SectionMaritime>

      {/* ── Section 3 · Services: text + card grid ── */}
      <SectionMaritime variant="services" className="section-py">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="text">
            <SectionHeading
              eyebrow="Services"
              title="Four practices, one"
              titleAccent="engineering standard"
              description="From concept design and structural analysis to surveys, audits and clean-fuel advisory — delivered by naval architects and Master Mariners."
              align="center"
            />
          </Reveal>

          <Reveal variant="card" delay={80} className="mt-16">
            <div className="grid gap-px overflow-hidden rounded-[1.75rem] border border-pelagic-navy/10 bg-pelagic-navy/10 sm:grid-cols-2 xl:grid-cols-4">
              {homeServices.map((service, i) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}/`}
                  className="home-service-tile group relative flex h-full min-h-[17rem] flex-col p-7 transition duration-500 sm:p-8"
                >
                  <span className="type-eyebrow text-pelagic-accent/80">
                    0{i + 1}
                  </span>
                  <h3 className="type-display type-card-title mt-5 leading-snug text-pelagic-ink transition group-hover:text-pelagic-navy">
                    {service.title}
                  </h3>
                  <p className="type-caption mt-3 flex-1 leading-relaxed">
                    {service.summary}
                  </p>
                  <span className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-pelagic-accent transition group-hover:gap-2.5">
                    Explore
                    <span aria-hidden>→</span>
                  </span>
                  <span
                    className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-pelagic-accent to-pelagic-blue transition duration-500 group-hover:scale-x-100"
                    aria-hidden
                  />
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-pelagic-accent transition hover:gap-3"
              >
                Explore all services
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* ── Section 4 · Why Pelagic: text + image ── */}
      <SectionMaritime variant="why" className="section-py">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-section lg:grid-cols-2 lg:items-start">
            <Reveal variant="text">
              <SectionHeading
                eyebrow="Why Pelagic"
                title="Expertise forged"
                titleAccent="at sea and ashore"
                description="Master Mariners, engineers, naval architects, and maritime lawyers — practical advice, not desk theory."
              />
              <ul className="mt-10">
                {highlights.map((item) => (
                  <li
                    key={item.title}
                    className="border-t border-pelagic-navy/10 py-5 first:border-t-0 first:pt-0"
                  >
                    <h3 className="text-base font-semibold text-pelagic-ink sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="type-caption mt-1.5 max-w-lg leading-relaxed">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal variant="image" delay={80}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:aspect-[4/3] lg:sticky lg:top-28">
                <SiteImage
                  src={siteImages.heroBridge}
                  alt="Pelagic Marine operations on the bridge"
                  fill
                  objectPosition={getImageObjectPosition(siteImages.heroBridge)}
                  className="object-cover"
                  sizes={imageSizes.contentHalf}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-pelagic-ink/35 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </Reveal>
          </div>

          <div className="mt-section">
            <StatsBand stats={stats} />
          </div>
        </div>
      </SectionMaritime>

      {/* ── Section 5 · Decarbonization: image + text ── */}
      <SectionMaritime variant="decarb" className="section-py">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-section lg:grid-cols-2 lg:items-center">
            <Reveal variant="image">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.85rem] shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:aspect-[5/4]">
                <SiteImage
                  src={siteImages.decarbonization}
                  alt="Clean energy turbines — maritime decarbonization"
                  fill
                  objectPosition={getImageObjectPosition(siteImages.decarbonization)}
                  className="object-cover transition duration-700 hover:scale-[1.03]"
                  sizes={imageSizes.contentHalf}
                />
              </div>
            </Reveal>

            <Reveal variant="text" delay={80}>
              <SectionHeading
                eyebrow="Decarbonization"
                title="Supporting the voyage to"
                titleAccent="cleaner seas"
                description={decarbonization.summary}
              />
              <ol className="mt-10 space-y-0">
                {decarbonization.points.slice(0, 4).map((point, i) => (
                  <li
                    key={point}
                    className="flex gap-4 border-t border-pelagic-navy/10 py-4 first:border-t-0 first:pt-0"
                  >
                    <span className="type-display shrink-0 text-sm text-pelagic-accent tabular-nums">
                      0{i + 1}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-pelagic-steel">
                      {point}
                    </span>
                  </li>
                ))}
              </ol>
              <Link
                href="/capabilities/clean-fuel/"
                className="cta-link mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-pelagic-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pelagic-accent/25 transition hover:bg-pelagic-accent-hover"
              >
                LNG bunkering & compatibility
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </SectionMaritime>

      {/* ── Section 6 · Clients: text + marquee card ── */}
      <section className="section-py relative z-10 overflow-hidden bg-transparent">
        <HeroSectionFill />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[#071a33]/38 lg:block"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal variant="text">
            <p className="type-eyebrow text-pelagic-accent">Clients</p>
            <h2 className="type-display type-section-title mt-4 text-white">
              Trusted across{" "}
              <span className="text-heading-accent">the fleet</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-blue-50/85">
              Owners, managers and operators who rely on Pelagic for surveys,
              engineering and clean-fuel advisory.
            </p>
          </Reveal>
        </div>
        <Reveal variant="card" delay={80} className="relative mt-section-sm">
          <ClientMarquee />
        </Reveal>
      </section>

      {/* ── Section 7 · CTA: fade-up on scroll ── */}
      <section className="section-py-lg relative z-10 overflow-hidden bg-[#071a33] text-white">
        <Reveal variant="text" className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-pelagic-accent">
            Next step
          </p>
          <h2 className="type-display type-section-title--lg mt-5 text-white">
            Let&apos;s move your{" "}
            <span className="text-heading-accent">project forward</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-blue-100/88 sm:text-lg">
            Naval architecture, surveys, engineering and clean-fuel advisory —
            from India and Dubai.
          </p>
          <div className="cta-stack mt-11">
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
