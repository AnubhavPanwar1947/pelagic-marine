import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { ClientMarquee } from "@/components/ui/ClientMarquee";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pelagic Marine Solutions is a naval architecture and marine engineering consultancy serving maritime, offshore, oil & gas and renewables clients worldwide.",
};

const valueCards = [
  {
    title: "Our mission",
    text: "To solve marine engineering problems with depth, data and design — giving owners, operators and charterers decisions they can stand behind.",
  },
  {
    title: "Our vision",
    text: "A consultancy where naval architecture and sea-going experience meet — setting the standard for technically rigorous, independent marine advisory.",
  },
  {
    title: "What we hold to",
    text: "Integrity in what we report. Engineering rigour in how we reach it. Practical judgement from time at sea. And a commitment to sustainable development.",
  },
] as const;

type SectionEyebrowProps = {
  children: string;
  className?: string;
};

function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
  return <p className={`type-eyebrow ${className}`}>{children}</p>;
}

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="Engineering depth, data and design — from Dubai to fleets worldwide"
        description="Pelagic Marine Solutions is a naval architecture and marine engineering consultancy. We exist to solve the problems most firms only survey."
      />

      <SectionMaritime variant="plain" className="section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-section lg:grid-cols-2 lg:items-center">
            <div className="max-w-[64ch] min-w-0">
              <SectionEyebrow>Who we are</SectionEyebrow>
              <p className="type-lead mt-5 text-pelagic-steel">
                Founded on a clear idea — that engineering, analysis and design should sit at the centre of
                marine consultancy, not at its edge — Pelagic Marine Solutions brings naval architects and
                Master Mariners together under one roof. We work across maritime, offshore, oil &amp; gas and
                renewables, combining licensed analysis tools with decades of sea-going and project experience.
              </p>
            </div>

            <div className="relative min-w-0 aspect-[3/2] overflow-hidden rounded-2xl border border-pelagic-mist/80">
              <SiteImage
                src={siteImages.aboutCollaboration}
                alt="Person holding printed plans and documents for review"
                fill
                objectPosition={getImageObjectPosition(siteImages.aboutCollaboration)}
                className="object-cover"
                sizes={imageSizes.contentHalf}
              />
            </div>
          </div>
        </div>
      </SectionMaritime>

      <SectionMaritime variant="mist" className="section-py-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Mission, vision, and values</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-2xl border border-pelagic-mist/90 bg-white p-8"
              >
                <h3 className="type-card-title font-display font-semibold text-pelagic-ink">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-pelagic-steel">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionMaritime>

      <section className="bg-pelagic-charcoal py-14 text-center text-white sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionEyebrow className="text-pelagic-accent">Our principle</SectionEyebrow>
          <h2 className="type-display type-subsection-title--lg mx-auto mt-4 max-w-[24ch] font-semibold">
            Sustainable development through innovation and integrity.
          </h2>
        </div>
      </section>

      <section className="section-py-md overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-[54ch] min-w-0">
            <SectionEyebrow>Clients</SectionEyebrow>
            <h2 className="type-display type-subsection-title mt-4 font-semibold text-pelagic-ink">
              Who we work with
            </h2>
            <p className="type-muted mt-5 text-base leading-7 text-pelagic-steel">
              Owners, operators, charterers, P&amp;I interests, insurers and offshore developers across
              the industry. Client marks shown here on request.
            </p>
          </div>
        </div>

        <div className="mt-8 min-w-0 w-full overflow-hidden">
          <div className="mx-auto w-full max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
            <ClientMarquee variant="quiet" fullWidth />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <Button href="/team" variant="secondary">
            Meet the team <span aria-hidden>→</span>
          </Button>
        </div>
      </section>
    </div>
  );
}
