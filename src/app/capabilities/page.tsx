import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilitiesSections } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "ANSYS, NAPA, AutoHydro, Optimoor and SACS; mooring and LNG compatibility analysis; and UMISTAB-X from Pelagic Marine Solutions.",
};

export default function CapabilitiesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Capabilities"
        title="The tools and methods behind the work"
        description="Licensed analysis suites and proprietary tools — applied by engineers and Master Mariners who understand both the physics and the operation."
        imageSrc={siteImages.expertise}
      />

      <SectionMaritime variant="mist" className="py-24" gridOpacity={48}>
        <div className="mx-auto max-w-7xl space-y-20 px-4 sm:px-6 lg:px-8">
        {capabilitiesSections.map((section) => (
          <article key={section.id} id={section.id} className="scroll-mt-28">
            <SectionHeading eyebrow={section.eyebrow} title={section.title} />
            <p className="mt-6 max-w-3xl text-base leading-8 text-pelagic-steel">
              {section.summary}
            </p>
            {"tags" in section && section.tags && (
              <div className="mt-6 flex flex-wrap gap-2">
                {section.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-pelagic-mist bg-pelagic-cream px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-pelagic-charcoal"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {section.id === "umistab" && (
              <div className="mt-8">
                <Button href="/contact" variant="primary">
                  Enquire about UMISTAB-X
                </Button>
              </div>
            )}
          </article>
        ))}
        </div>
      </SectionMaritime>

      <section className="bg-pelagic-charcoal py-20 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Need the right tool applied to your problem?
          </h2>
          <p className="mx-auto mt-5 text-lg text-slate-300">
            Tell us the vessel, structure or operation — we will scope the analysis and assign the right engineer.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/contact" variant="primary">
              Contact the team
            </Button>
            <Link href="/services" className="text-sm font-bold text-pelagic-accent hover:underline">
              Explore services →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
