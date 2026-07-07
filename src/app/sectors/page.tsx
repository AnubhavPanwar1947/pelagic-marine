import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { sectorDetails } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Maritime, offshore, renewables, and ports — sector expertise from Pelagic Marine Solutions.",
};

export default function SectorsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Sectors"
        title="Cross-sector marine expertise"
        description="The same technical excellence applied across shipping, offshore energy, renewables, and port infrastructure."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
            {sectorDetails.map((sector, i) => (
              <Reveal key={sector.slug} delay={i * 80}>
                <article
                  id={sector.slug}
                  className="card-premium scroll-mt-28 rounded-3xl border border-pelagic-sand bg-white p-8 shadow-sm"
                >
                <h2 className="font-display text-xl font-semibold text-pelagic-ink">
                  {sector.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-pelagic-slate">
                  {sector.summary}
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex text-sm font-bold text-pelagic-gold hover:underline"
                >
                  View related services →
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
