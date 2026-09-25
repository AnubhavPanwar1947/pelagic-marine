import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  company,
  decarbonization,
  serviceCategories,
} from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import {
  getImageObjectPosition,
  homeServiceIcons,
  siteImages,
} from "@/lib/site-images";
import "./home-theme.css";

const homeServices = serviceCategories.filter((service) => service.home !== false);

const homeAboutHeroImageSrc = "/images/stock/about.png";
const homeAboutHeroImageAlt =
  "Marine office desk with a ship model, technical blueprint, and harbor view.";

const homeAboutWhoWeAre =
  "Pelagic Marine Solutions brings naval architects and Master Mariners together to deliver engineering, analysis and design grounded in real marine operations. Across maritime, offshore, oil & gas and renewables, we combine licensed analysis tools with decades of sea-going and project experience.";

export default function HomePage() {
  return (
    <>
      {/* ── Section 1 · Hero: staggered entrance on page load ── */}
      <section className="home-hero-section home-hero-section--parallax relative z-0 flex min-h-[100svh] min-h-[100dvh] flex-col overflow-hidden bg-[#071a33] lg:min-h-[100dvh]">
        <HeroMedia className="pointer-events-none" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28 lg:pt-32">
          <div className="home-hero-copy w-full max-w-3xl">
            <p className="home-hero-line home-hero-line--1 home-hero-brand-name text-white">
              Pelagic Marine
            </p>
            <p className="home-hero-line home-hero-line--2 home-hero-brand-tagline">
              SOLUTIONS · INDIA &amp; DUBAI
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

      <div className="home-page">
        {/* ── Section 2 · Services: white ── */}
        <SectionMaritime
          variant="services"
          className="home-theme-services border-b border-pelagic-sand section-py"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal variant="text">
              <SectionHeading
                eyebrow="Services"
                title="Four practices, one"
                titleAccent="engineering standard"
                align="center"
              />
            </Reveal>

            <Reveal variant="card" delay={80} className="mt-16">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
                {homeServices.map((service) => (
                  <Link
                    key={service.slug}
                    href={`/services/${service.slug}/`}
                    className="home-service-tile group relative flex h-full min-h-[17rem] flex-col items-center justify-start rounded-xl p-7 motion-reduce:transition-none sm:p-8"
                  >
                    <span className="home-service-tile-icon">
                      <Image
                        src={
                          homeServiceIcons[
                            service.slug as keyof typeof homeServiceIcons
                          ]
                        }
                        alt=""
                        width={163}
                        height={169}
                        className="home-service-tile-icon__img object-contain"
                        sizes="167px"
                      />
                    </span>
                    <span className="home-service-tile-label">{service.title}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Button href="/services" variant="primary">
                  Explore all services
                </Button>
              </div>
            </Reveal>
          </div>
        </SectionMaritime>

        {/* ── Section 4 · About us: icy blue ── */}
        <SectionMaritime
          variant="why"
          className="home-theme-why border-b border-pelagic-sand section-py"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-section lg:grid-cols-2 lg:items-start">
              <Reveal variant="text">
                <SectionHeading
                  eyebrow="About us"
                  title="Who we are"
                  description={homeAboutWhoWeAre}
                />
                <div className="mt-10">
                  <Button href="/about" variant="outline">
                    About us
                  </Button>
                </div>
              </Reveal>

              <Reveal variant="image" delay={80} className="min-w-0 w-full max-w-full">
                <div className="relative aspect-[16/9] w-full min-w-0 max-w-full overflow-hidden rounded-[1.25rem] bg-white shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:rounded-[1.85rem]">
                  <SiteImage
                    src={homeAboutHeroImageSrc}
                    alt={homeAboutHeroImageAlt}
                    fill
                    objectPosition="42% center"
                    className="object-cover"
                    sizes={imageSizes.contentHalf}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </SectionMaritime>

        {/* ── Section 5 · Decarbonization: white ── */}
        <SectionMaritime
          variant="decarb"
          className="home-theme-decarb border-b border-pelagic-sand section-py"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-section lg:grid-cols-2 lg:items-center">
              <Reveal variant="image">
                <div className="home-image-card home-decarb-image-card relative aspect-[4/3] overflow-hidden rounded-[1.85rem] bg-white shadow-[0_28px_60px_rgba(14,35,94,0.14)]">
                  <SiteImage
                    src={siteImages.decarbonizationHome}
                    alt="LNG carrier at sea — maritime decarbonization and clean fuels"
                    fill
                    objectPosition={getImageObjectPosition(siteImages.decarbonizationHome)}
                    className="object-cover transition duration-700 hover:scale-[1.03] motion-reduce:transition-none motion-reduce:hover:scale-100"
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
                      className="flex gap-4 border-t border-pelagic-sand py-4 first:border-t-0 first:pt-0"
                    >
                      <span className="type-display shrink-0 text-sm text-pelagic-accent tabular-nums">
                        0{i + 1}
                      </span>
                      <span className="type-copy">
                        {point}
                      </span>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/capabilities/clean-fuel/"
                  className="cta-link mt-10 inline-flex w-fit items-center gap-2 rounded-full bg-pelagic-accent px-7 py-3.5 text-[15px] font-semibold text-white shadow-lg shadow-pelagic-accent/25 transition hover:bg-pelagic-accent-hover"
                >
                  LNG bunkering & compatibility
                </Link>
              </Reveal>
            </div>
          </div>
        </SectionMaritime>

        {/* ── Section 6 · Clients: icy blue ── */}
        <section className="home-section-clients overflow-x-hidden border-b border-pelagic-sand section-py">
          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal variant="text">
              <p className="type-eyebrow">Clients</p>
              <h2 className="type-display type-section-title mt-4 text-[#0e235e]">
                Trusted across{" "}
                <span className="text-heading-accent">the fleet</span>
              </h2>
              <p className="type-copy mx-auto mt-5 max-w-xl">
                Owners, managers and operators who rely on Pelagic for surveys,
                engineering and clean-fuel advisory.
              </p>
            </Reveal>
          </div>
          <Reveal variant="card" delay={80} className="relative mt-section-sm">
            <div className="home-client-marquee-strip w-full min-w-0 overflow-hidden border-y border-pelagic-sand py-6 sm:py-7">
              <div className="w-full min-w-0 max-w-none [&_.pelagic-client-marquee-track>span]:!shadow-none [&_ul>li>span]:!shadow-none">
                <ClientMarquee fullWidth whiteGaps />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Section 7 · CTA: light icy blue ── */}
        <section className="home-section-cta section-py-lg">
          <Reveal variant="text" className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <p className="type-eyebrow">Next step</p>
            <h2 className="type-display type-section-title--lg mt-5 text-[#0e235e]">
              Let&apos;s move your{" "}
              <span className="text-heading-accent">project forward</span>
            </h2>
            <p className="type-lead mx-auto mt-6 max-w-xl">
              Naval architecture, surveys, engineering and clean-fuel advisory —
              from India and Dubai.
            </p>
            <div className="cta-stack mt-11">
              <Button href="/contact" variant="primary">
                Get in touch
              </Button>
              <Button
                href={`tel:${company.phones.india.replace(/\s/g, "")}`}
                variant="outline"
                external
              >
                Call {company.phones.india}
              </Button>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}
