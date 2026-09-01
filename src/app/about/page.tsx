import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { company } from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, siteImages } from "@/lib/site-images";
import "./about-theme.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pelagic Marine Solutions is a naval architecture and marine engineering consultancy in Dubai, serving maritime, offshore, oil & gas and renewables clients worldwide.",
};

const principles = [
  {
    title: "Our mission",
    points: [
      "Solve marine engineering problems with depth, data and design.",
      "Give owners, operators and charterers decisions they can stand behind.",
    ],
  },
  {
    title: "Our vision",
    points: [
      "Bring naval architecture and sea-going experience together.",
      "Set the standard for technically rigorous, independent marine advisory.",
    ],
  },
  {
    title: "What we hold to",
    points: [
      "Integrity in what we report.",
      "Engineering rigour in how we reach it.",
      "Practical judgement from time at sea.",
      "A commitment to sustainable development.",
    ],
  },
] as const;

const proofItems = [
  { label: `Founded ${company.founded}` },
  { label: "India · UAE" },
  { label: "Worldwide project support" },
] as const;

const industryCategories = [
  "Owners",
  "Operators",
  "Charterers",
  "P&I Interests",
  "Insurers",
  "Offshore Developers",
] as const;

const builtAround = [
  "Naval architecture",
  "Marine engineering",
  "Sea-going experience",
] as const;

export default function AboutPage() {
  return (
    <div>
      <section className="about-theme-hero border-b border-pelagic-sand">
        <div className="mx-auto min-w-0 max-w-7xl px-4 page-hero-py sm:px-6 lg:px-8">
          <div className="grid gap-section lg:grid-cols-2 lg:items-center">
            <Reveal variant="text">
              <div className="min-w-0">
                <p className="type-eyebrow">About</p>
                <h1 className="type-display type-page-title mt-4 max-w-4xl min-w-0 break-words font-medium text-[#0e235e]">
                  Engineering depth, data and design — from Dubai to fleets worldwide
                </h1>
                <p className="type-lead mt-5 max-w-2xl font-normal text-[#364b5e]">
                  Pelagic Marine Solutions is a naval architecture and marine engineering consultancy.
                  We exist to solve the problems most firms only survey.
                </p>
              </div>
            </Reveal>

            <Reveal variant="image" delay={80}>
              <div className="group relative min-w-0 aspect-[3/2] overflow-hidden rounded-xl border border-pelagic-sand bg-white transition-[border-color,background-color] duration-300 ease-out lg:hover:border-[#E6F4FC] lg:hover:bg-[#F4FAFD]">
                <SiteImage
                  src={siteImages.aboutCollaboration}
                  alt="Person holding printed plans and documents for review"
                  fill
                  priority
                  objectPosition={getImageObjectPosition(siteImages.aboutCollaboration)}
                  className="object-cover transition-transform duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none lg:group-hover:scale-[1.01]"
                  sizes={imageSizes.contentHalf}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-theme-who border-b border-pelagic-sand section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-section lg:grid-cols-2 lg:items-start">
            <Reveal variant="text">
              <div className="min-w-0">
                <p className="type-eyebrow">Who we are</p>
                <div className="group/who mt-5 flex gap-5 sm:gap-6">
                  <div
                    className="w-0.5 shrink-0 self-stretch rounded-full bg-[#E6F4FC] transition-colors duration-300 ease-out group-hover/who:bg-[#F4FAFD] motion-reduce:transition-none"
                    aria-hidden
                  />
                  <p className="type-lead max-w-[64ch] min-w-0 font-normal text-[#364b5e]">
                    Pelagic Marine Solutions brings naval architects and Master Mariners together to
                    deliver engineering, analysis and design grounded in real marine operations.
                    Across maritime, offshore, oil &amp; gas and renewables, we combine licensed
                    analysis tools with decades of sea-going and project experience.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="text" delay={80}>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold tracking-wide text-[#0e235e] sm:text-base">
                  Built around
                </h3>
                <ul className="mt-5 border-t border-pelagic-sand">
                  {builtAround.map((item, index) => (
                    <li
                      key={item}
                      className={`group/row flex gap-3 py-4 text-base leading-7 text-[#364b5e] transition-[background-color,border-color,color] duration-300 ease-out hover:bg-[#F4FAFD] hover:text-[#0e235e] motion-reduce:transition-none motion-reduce:hover:text-[#364b5e] ${
                        index < builtAround.length - 1
                          ? "border-b border-pelagic-sand"
                          : ""
                      }`}
                    >
                      <span
                        className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0e235e]"
                        aria-hidden
                      />
                      <span className="transition-transform duration-300 ease-out group-hover/row:translate-x-0.5 motion-reduce:transform-none">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-theme-principles border-b border-pelagic-sand section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="text">
            <div className="max-w-3xl min-w-0">
              <h2 className="type-display type-subsection-title--lg min-w-0 break-words font-medium text-[#0e235e]">
                Depth in the analysis. Clarity in the outcome.
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 lg:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} variant="card" delay={index * 80} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-pelagic-sand bg-white px-6 py-7 shadow-[0_4px_24px_rgba(7,26,51,0.04)] transition-[border-color,background-color,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#E6F4FC] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-7 sm:py-8">
                  <div
                    className="absolute bottom-7 left-0 top-7 w-0.5 rounded-full bg-[#E6F4FC] transition-[width,background-color] duration-300 ease-out group-hover:w-1 group-hover:bg-[#F4FAFD] motion-reduce:transition-none sm:bottom-8 sm:top-8"
                    aria-hidden
                  />
                  <div className="relative flex h-full flex-col pl-5 sm:pl-6">
                    <h3 className="type-display type-card-title font-medium text-[#0e235e]">
                      {principle.title}
                    </h3>
                    <ul className="mt-3 flex-1 space-y-2.5 text-sm leading-7 text-[#364b5e] sm:text-base">
                      {principle.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span
                            className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0e235e]"
                            aria-hidden
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-surface-icy border-b border-pelagic-sand py-12 text-center sm:py-14">
        <Reveal variant="fade">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="type-eyebrow">Our principle</p>
            <h2 className="type-display type-subsection-title--lg mx-auto mt-4 max-w-[24ch] font-medium text-[#0e235e]">
              Sustainable development through innovation and integrity.
            </h2>
          </div>
        </Reveal>

        <Reveal variant="fade" delay={80}>
          <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
            <ul className="flex flex-col items-center justify-center gap-6 text-center sm:flex-row sm:gap-0">
              {proofItems.map((item, index) => (
                <li
                  key={item.label}
                  className={`group/proof min-w-0 rounded-md px-4 py-2 transition-colors duration-300 ease-out hover:bg-[#F4FAFD] motion-reduce:transition-none sm:flex-1 ${
                    index > 0 ? "sm:border-l sm:border-pelagic-sand" : ""
                  }`}
                >
                  <p className="text-sm font-medium tracking-wide text-[#0e235e] sm:text-[0.9375rem]">
                    {item.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="about-surface-soft overflow-x-hidden section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="text">
            <div className="max-w-[54ch] min-w-0">
              <p className="type-eyebrow">Clients</p>
              <h2 className="type-display type-subsection-title mt-4 font-medium text-[#0e235e]">
                Who we work with
              </h2>
              <p className="mt-5 text-base font-normal leading-7 text-[#364b5e]">
                Owners, operators, charterers, P&amp;I interests, insurers and offshore developers
                across the industry.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="about-surface-soft about-client-marquee-strip mt-8 min-w-0 w-full overflow-hidden border-y border-pelagic-sand py-6 sm:py-7">
          <div className="w-full min-w-0 max-w-none [&_.pelagic-client-marquee-track>span]:!shadow-none [&_ul>li>span]:!shadow-none">
            <ClientMarquee fullWidth whiteGaps items={industryCategories} />
          </div>
        </div>

        <Reveal variant="text" delay={80}>
          <div className="mx-auto mt-8 max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <Button
              href="/team"
              variant="primary"
              className="transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent motion-reduce:hover:translate-y-0 motion-reduce:active:translate-y-0"
            >
              Meet the team
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
