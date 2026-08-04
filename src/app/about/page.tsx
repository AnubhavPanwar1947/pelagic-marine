import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pelagic Marine Solutions is a naval architecture and marine engineering consultancy serving maritime, offshore, oil & gas and renewables clients worldwide.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="Engineering depth, data and design — from Dubai to fleets worldwide"
        description="Pelagic Marine Solutions is a naval architecture and marine engineering consultancy. We exist to solve the problems most firms only survey."
        imageSrc={siteImages.pageHeroes.about}
      />

      <SectionMaritime variant="plain" className="py-24" gridOpacity={40}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Who we are" title="Built around engineering, analysis and design" />
          <p className="mt-6 max-w-3xl text-base leading-8 text-pelagic-steel">
            Founded on a clear idea — that engineering, analysis and design should sit at the centre of
            marine consultancy, not at its edge — Pelagic Marine Solutions brings naval architects and
            Master Mariners together under one roof. We work across maritime, offshore, oil &amp; gas and
            renewables, combining licensed analysis tools with decades of sea-going and project experience.
          </p>
        </div>
      </SectionMaritime>

      <SectionMaritime variant="mist" className="py-20" gridOpacity={50}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
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
            ].map((card) => (
              <article
                key={card.title}
                className="card-maritime rounded-3xl border p-8 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold text-pelagic-ink">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-pelagic-steel">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </SectionMaritime>

      <section className="bg-pelagic-charcoal py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">Our principle</p>
          <h2 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
            Sustainable development through innovation and integrity.
          </h2>
        </div>
      </section>
    </div>
  );
}
