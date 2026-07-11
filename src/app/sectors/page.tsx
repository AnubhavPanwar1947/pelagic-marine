import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { sectorDetails } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

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
        imageSrc={siteImages.pageHeroes.sectors}
      />
      <SectionMaritime className="py-20" gridOpacity={50}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
            {sectorDetails.map((sector, i) => (
              <Reveal key={sector.slug} delay={i * 80}>
                <article
                  id={sector.slug}
                  className="card-premium card-maritime scroll-mt-28 overflow-hidden rounded-3xl border shadow-sm"
                >
                <div className="relative aspect-[16/9]">
                  <SiteImage
                    src={siteImages.sectors[sector.slug as keyof typeof siteImages.sectors]}
                    alt={sector.title}
                    fill
                    brandOverlay
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="p-8">
                <h2 className="font-display text-xl font-semibold text-pelagic-ink">
                  {sector.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-pelagic-slate">
                  {sector.summary}
                </p>
                <Link
                  href="/services"
                  className="mt-5 inline-flex text-sm font-bold text-pelagic-accent hover:underline"
                >
                  View related services →
                </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        </div>
      </SectionMaritime>
    </div>
  );
}
