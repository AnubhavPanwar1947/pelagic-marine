import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import { HeroMedia } from "@/components/ui/HeroMedia";
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

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <section className="relative min-h-[78vh] overflow-hidden lg:min-h-[86vh]">
        <HeroMedia />
        <div
          className="absolute inset-0 bg-gradient-to-r from-pelagic-ink/72 via-pelagic-navy/35 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-pelagic-ink/40 via-transparent to-pelagic-ink/18"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:min-h-[86vh] lg:px-8 lg:py-28">
          <div className="animate-fade-up max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-pelagic-accent">
              Pelagic Marine Solutions · India & Dubai
            </p>
            <h1 className="type-display mt-5 text-4xl leading-[1.05] text-white sm:text-5xl lg:text-[3.6rem]">
              {company.heroHeadline}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-blue-50/90 sm:text-lg">
              {company.heroSubline}
            </p>
            <div className="mt-9">
              <Button href="/contact" variant="primary">
                Start a consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Delivery & capability */}
      <SectionMaritime variant="mist" className="py-20 lg:py-24" gridOpacity={48}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <ProjectsCapabilitiesCard />
          </Reveal>
        </div>
      </SectionMaritime>

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
          <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {serviceCategories
              .filter((service) => service.home !== false)
              .map((service, i) => (
              <Reveal key={service.slug} delay={i * 50}>
                <Link
                  href={`/services/${service.slug}/`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-white via-white to-pelagic-sky/35 p-6 shadow-[0_18px_40px_rgba(20,48,110,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(20,48,110,0.1)] sm:p-7"
                >
                  <span
                    className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-pelagic-accent to-pelagic-navy/40 opacity-70 transition group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="type-eyebrow text-pelagic-accent/90">0{i + 1}</span>
                  <h3 className="type-display mt-4 text-xl leading-snug text-pelagic-ink">
                    {service.title}
                  </h3>
                  <p className="type-caption mt-3 flex-1">{service.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pelagic-accent transition group-hover:gap-2.5">
                    Explore
                    <span aria-hidden>→</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link href="/services" className="text-sm font-semibold text-pelagic-accent hover:underline">
              Explore all services →
            </Link>
          </Reveal>
        </div>
      </SectionMaritime>

      {/* 4. Decarbonization — open split like Why Pelagic */}
      <SectionMaritime variant="sand" className="py-20 lg:py-24" gridOpacity={45}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] shadow-md sm:aspect-[5/4]">
                <SiteImage
                  src={siteImages.decarbonization}
                  alt="Clean energy turbines — maritime decarbonization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-pelagic-ink/50 via-transparent to-transparent"
                  aria-hidden
                />
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="space-y-7">
                <SectionHeading eyebrow="Decarbonization" title={decarbonization.headline} />

                <div className="relative overflow-hidden rounded-[1.5rem] border border-pelagic-sand shadow-sm">
                  <SiteImage
                    src={siteImages.decarbonization}
                    alt="Supporting the voyage to cleaner seas"
                    fill
                    className="object-cover object-[50%_35%]"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </SectionMaritime>

      {/* 5. Why Pelagic */}
      <SectionMaritime variant="mist" className="border-y border-pelagic-sand py-20" gridOpacity={48}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <SectionHeading
                eyebrow="Why Pelagic"
                title="Expertise forged at sea and ashore"
                description="Master Mariners, engineers, naval architects, and maritime lawyers — practical advice, not desk theory."
              />
              <div className="mt-8 space-y-3">
                {highlights.map((item) => (
                  <div key={item.title} className="card-maritime rounded-2xl border bg-white/80 p-4 sm:p-5">
                    <h3 className="font-semibold text-pelagic-ink">{item.title}</h3>
                    <p className="type-caption mt-1">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="space-y-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-pelagic-sand shadow-md sm:aspect-[4/3]">
                  <SiteImage
                    src={siteImages.hero}
                    alt="Pelagic Marine operations on the bridge"
                    fill
                    className="object-cover object-[58%_center]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-pelagic-ink/45 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="card-maritime rounded-2xl border bg-white p-4 text-center sm:p-5"
                    >
                      <p className="type-display text-2xl text-pelagic-accent sm:text-3xl">
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

      {/* 6. Clients */}
      <SectionMaritime variant="mist" className="border-y border-pelagic-sand py-20 lg:py-24" gridOpacity={42}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Clients"
              title="Trusted across the fleet"
              description="Owners, managers and operators who rely on Pelagic for surveys, engineering and clean-fuel advisory."
              align="center"
            />
          </Reveal>
          <div className="mt-12">
            <ClientMarquee />
          </div>
        </div>
      </SectionMaritime>

      {/* 7. CTA */}
      <section className="relative overflow-hidden py-24 text-white lg:py-28">
        <SiteImage
          src={siteImages.cta}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-pelagic-ink/80" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-pelagic-navy/70 via-transparent to-pelagic-accent/20"
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-pelagic-accent">
            Next step
          </p>
          <h2 className="type-display mt-4 text-3xl text-white sm:text-4xl lg:text-5xl">
            Let&apos;s move your project forward
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-blue-100/90">
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
