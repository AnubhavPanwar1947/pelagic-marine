import type { Metadata } from "next";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import "./about-theme.css";

const aboutHeroImageSrc = "/images/stock/about.png";
const aboutHeroImageAlt =
  "Marine office desk with a ship model, technical blueprint, and harbor view.";
export const metadata: Metadata = {
  title: "About",
  description:
    "Pelagic Marine Solutions is a naval architecture and marine engineering consultancy in Dubai, serving maritime, offshore, oil & gas and renewables clients worldwide.",
};

const principles = [
  {
    title: "Our mission",
    iconSrc: "/images/icons/mission.svg",
    iconAlt: "Our mission",
    points: [
      "Our mission is to transform the shipping industry into a sustainable and progressive industry.",
      "We do this by innovation and technology.",
    ],
  },
  {
    title: "Our vision",
    iconSrc: "/images/icons/vision.svg",
    iconAlt: "Our vision",
    body: "Our vision is to be the leaders in the field of Marine, Surveying, Engineering and Design",
  },
  {
    title: "Values",
    iconSrc: "/images/icons/values.svg",
    iconAlt: "Values",
    points: [
      "Sustainable shipping and innovation.",
      "Integrity and customer satisfaction are core values of our organization.",
    ],
  },
] as const;
export default function AboutPage() {
  return (
    <div>
      <section className="about-theme-hero border-b border-pelagic-sand">
        <div className="about-theme-hero__inner mx-auto min-w-0 max-w-7xl px-1.5 page-hero-py sm:px-6 lg:px-8">
          <div className="about-theme-hero__grid grid w-full min-w-0 gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-section">
            <Reveal variant="text" className="min-w-0">
              <div className="min-w-0">
                <h1 className="type-display min-w-0 break-words text-[28px] font-semibold normal-case leading-tight text-[#0e235e] sm:text-[30px] lg:text-[32px]">
                  About Us
                </h1>
                <p className="type-lead mt-5 max-w-[75ch] min-w-0 break-words font-normal text-pelagic-copy">
                  Pelagic marine consultants and surveyors was formed in year 2021 by young
                  entrepreneurs from the shipping and engineering fraternity with wide range of
                  experience in vessel operations, ship surveying, Engineering, offshore operations,
                  dry &amp; wet cargo handling and maritime legal solutions. The company was formed
                  to act as a one stop shop for various shipping industry centric solution. The core
                  team consists of experienced Master Mariners, Marine engineers, naval architects and
                  Lawyers. We provide professional services to our clients from mainline shipping, oil
                  &amp; gas industry, offshore industry and renewable energy sector.
                </p>
              </div>
            </Reveal>

            <Reveal variant="image" delay={80} className="min-w-0 w-full max-w-full">
              <div className="about-theme-hero__media relative aspect-[16/9] w-full min-w-0 max-w-full overflow-hidden rounded-[1.25rem] bg-white shadow-[0_28px_60px_rgba(14,35,94,0.14)] sm:rounded-[1.85rem]">
                <SiteImage
                  src={aboutHeroImageSrc}
                  alt={aboutHeroImageAlt}
                  fill
                  objectPosition="42% center"
                  className="object-cover"
                  sizes={imageSizes.contentHalf}
                  priority
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="about-theme-principles section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal variant="text">
            <div className="max-w-3xl min-w-0">
              <h2 className="type-display type-subsection-title--lg min-w-0 break-words font-medium text-[#0e235e]">
                What guides us
              </h2>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.title} variant="card" delay={index * 80} className="h-full">
                <article className="flex h-full min-h-0 flex-col items-center rounded-xl border border-pelagic-sand bg-white px-6 py-8 text-center shadow-[0_4px_24px_rgba(7,26,51,0.04)] sm:px-7 sm:py-9">
                  <span className="relative block aspect-square w-[min(120px,100%)] max-w-[120px] shrink-0">
                    <Image
                      src={principle.iconSrc}
                      alt={principle.iconAlt}
                      width={120}
                      height={120}
                      className="size-full object-contain"
                      sizes="120px"
                    />
                  </span>
                  <h3 className="type-display type-card-title mt-5 max-w-full font-bold text-[#0e235e]">
                    {principle.title}
                  </h3>
                  {"points" in principle ? (
                    <ul className="mx-auto mt-4 w-full max-w-[28rem] flex-1 space-y-2.5 text-left text-sm leading-7 text-pelagic-copy sm:text-base">
                      {principle.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span
                            className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#0e235e]"
                            aria-hidden
                          />
                          <span className="min-w-0 break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 max-w-full flex-1 text-sm leading-7 text-pelagic-copy sm:text-base">
                      {principle.body}
                    </p>
                  )}                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}