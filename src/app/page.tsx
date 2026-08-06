import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import { CtaParallaxMedia } from "@/components/ui/CtaParallaxMedia";
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
import {
  company,
  decarbonization,
  highlights,
  serviceCategories,
  stats,
} from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

const homeServices = serviceCategories.filter((service) => service.home !== false);

export default function HomePage() {
  return (
    <>
      <HeroParallaxBackdrop />

      {/* ── Hero: brand-first, full-bleed, calm (Aqualis / Kannamwar) ── */}
      <section className="relative z-10 flex min-h-[100svh] flex-col overflow-hidden bg-transparent lg:min-h-[100vh]">
        <HeroMedia />

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="home-hero-copy max-w-3xl">
            <p
              className="text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[0.95] tracking-[-0.02em] text-white"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }}
            >
              Pelagic Marine
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-pelagic-accent sm:text-xs">
              Solutions · India & Dubai
            </p>
            <h1 className="type-display mt-8 max-w-2xl text-[1.85rem] leading-[1.12] text-white sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]">
              Serving the shipping industry,{" "}
              <span className="text-heading-accent">round the clock.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-blue-50/88 sm:text-lg">
              {company.heroSubline}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary">
                Start a consultation
              </Button>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:gap-3 hover:text-white"
              >
                Explore services
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>

        <div
          className="home-scroll-cue pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
          aria-hidden
        >
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Scroll
          </span>
          <span className="home-scroll-line block h-10 w-px bg-gradient-to-b from-white/70 to-transparent" />
        </div>
      </section>

      {/* ── Delivery: solid wash (no parallax) ── */}
      <SectionMaritime variant="delivery" className="relative z-10 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <ProjectsCapabilitiesCard />
          </Reveal>
        </div>
      </SectionMaritime>

      {/* ── Services: opaque editorial grid (Kannamwar / Foreship) ── */}
      <SectionMaritime variant="services" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title="Four practices, one"
              titleAccent="engineering standard"
              description="From concept design and structural analysis to surveys, audits and clean-fuel advisory — delivered by naval architects and Master Mariners."
              align="center"
            />
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[1.75rem] border border-pelagic-navy/10 bg-pelagic-navy/10 sm:grid-cols-2 xl:grid-cols-4">
            {homeServices.map((service, i) => (
              <Reveal key={service.slug} delay={i * 60} className="h-full">
                <Link
                  href={`/services/${service.slug}/`}
                  className="home-service-tile group relative flex h-full min-h-[17rem] flex-col p-7 transition duration-500 sm:p-8"
                >
                  <span className="type-eyebrow text-pelagic-accent/80">
                    0{i + 1}
                  </span>
                  <h3 className="type-display mt-5 text-xl leading-snug text-pelagic-ink transition group-hover:text-pelagic-navy sm:text-[1.35rem]">
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
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm font-semibold text-pelagic-accent transition hover:gap-3"
            >
              Explore all services
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* ── Decarbonization: Azolla / C-Job storytelling ── */}
      <SectionMaritime variant="decarb" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal>
              <div className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.85rem] shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:aspect-[5/4]">
                  <SiteImage
                    src={siteImages.decarbonization}
                    alt="Clean energy turbines — maritime decarbonization"
                    fill
                    className="object-cover transition duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <p className="mt-4 text-sm font-medium tracking-wide text-pelagic-slate">
                  Clean fuels · Compliance · Practical transition
                </p>
              </div>
            </Reveal>

            <Reveal delay={80}>
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
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-pelagic-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pelagic-accent/25 transition hover:bg-pelagic-accent-hover"
              >
                LNG bunkering & compatibility
                <span aria-hidden>→</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </SectionMaritime>

      {/* ── Why Pelagic: proof without card clutter ── */}
      <SectionMaritime variant="why" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start lg:gap-20">
            <Reveal>
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

            <Reveal delay={100}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:aspect-[4/3] lg:sticky lg:top-28">
                <SiteImage
                  src={siteImages.heroBridge}
                  alt="Pelagic Marine operations on the bridge"
                  fill
                  className="object-cover object-[58%_center]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-pelagic-ink/35 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </Reveal>
          </div>

          {/* Aqualis-style restrained numbers band */}
          <Reveal className="mt-16 lg:mt-20">
            <div className="home-stats-band grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-pelagic-sand bg-pelagic-sand sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/95 px-4 py-6 text-center sm:px-5 sm:py-7"
                >
                  <p className="type-display text-2xl text-pelagic-accent sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="type-muted mt-2 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* ── Clients: photo returns (Kannamwar full-bleed marquee) ── */}
      <section className="relative z-10 overflow-hidden bg-transparent py-20 lg:py-28">
        <HeroSectionFill />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[#071a33]/38 lg:block"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="type-eyebrow text-pelagic-accent">Clients</p>
            <h2 className="type-display mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
              Trusted across{" "}
              <span className="text-heading-accent">the fleet</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-blue-50/85">
              Owners, managers and operators who rely on Pelagic for surveys,
              engineering and clean-fuel advisory.
            </p>
          </Reveal>
        </div>
        <div className="relative mt-14 sm:mt-16">
          <ClientMarquee />
        </div>
      </section>

      {/* ── Next step: animated photo background ── */}
      <section className="relative z-10 overflow-hidden py-28 text-white lg:py-36">
        <CtaParallaxMedia src={siteImages.cta} />
        <div className="absolute inset-0 bg-[#071a33]/62" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#071a33]/20 via-transparent to-[#071a33]/55"
          aria-hidden
        />
        <Reveal className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-pelagic-accent">
            Next step
          </p>
          <h2 className="type-display mt-5 text-3xl text-white sm:text-4xl lg:text-[3.25rem] lg:leading-[1.08]">
            Let&apos;s move your{" "}
            <span className="text-heading-accent">project forward</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-blue-100/88 sm:text-lg">
            Naval architecture, surveys, engineering and clean-fuel advisory —
            from India and Dubai.
          </p>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-4">
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
