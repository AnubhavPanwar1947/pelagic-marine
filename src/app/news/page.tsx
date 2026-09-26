import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { newsItems } from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, siteImages } from "@/lib/site-images";

const advisoryExpansionHeroSrc = "/images/blog-hero.png";

function getNewsCardImageSrc(slug: string, index: number) {
  if (slug === "advisory-expansion-india-uae") {
    return advisoryExpansionHeroSrc;
  }
  return siteImages.news[index] ?? siteImages.news[0];
}

export const metadata: Metadata = {
  title: "Marine Insights",
  description:
    "Articles on marine engineering, inspections, surveying, offshore operations, and maritime advisory topics.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NewsPage() {
  return (
    <div>
      <PageHero
        compact
        title="Marine Insights"
        description="Articles on marine engineering, inspections, surveying, offshore operations, and maritime advisory topics."
      />
      <SectionMaritime variant="mist" className="pb-20 pt-8 sm:pt-10" gridOpacity={48}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {newsItems.map((item, i) => {
            const isAdvisoryExpansion = item.slug === "advisory-expansion-india-uae";
            const imageSrc = getNewsCardImageSrc(item.slug, i);

            return (
            <Reveal key={item.slug} delay={i * 60}>
              <article className="card-premium card-maritime overflow-hidden rounded-3xl border shadow-sm">
                <div className="grid min-w-0 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                  <div
                    className={
                      isAdvisoryExpansion
                        ? "relative aspect-[21/9] min-w-0 overflow-hidden bg-white md:aspect-auto md:min-h-[12rem]"
                        : "relative aspect-[16/10] min-w-0 overflow-hidden md:aspect-auto md:min-h-[10rem]"
                    }
                  >
                    <SiteImage
                      src={imageSrc}
                      alt={
                        isAdvisoryExpansion
                          ? "Computational fluid dynamics phase volume fraction contour plot"
                          : item.title
                      }
                      fill
                      brandOverlay={!isAdvisoryExpansion}
                      objectPosition={
                        isAdvisoryExpansion
                          ? "center center"
                          : getImageObjectPosition(imageSrc)
                      }
                      className={isAdvisoryExpansion ? "object-contain" : "object-cover"}
                      sizes={imageSizes.newsCard}
                    />
                  </div>
                  <div className="min-w-0 p-4 sm:p-6 md:p-8">
                {isAdvisoryExpansion ? (
                  <>
                    <h2 className="font-display min-w-0 break-words text-xl font-semibold text-pelagic-ink">
                      Computational Fluid Dynamics
                    </h2>
                    <p className="mt-3 min-w-0 break-words text-sm font-semibold leading-relaxed text-pelagic-ink">
                      That&apos;s not theory. That&apos;s operational mathematics.
                    </p>
                    <p className="mt-3 max-w-3xl min-w-0 break-words text-sm leading-relaxed text-pelagic-copy">
                      CFD reveals how vessel-flow analysis can guide resistance reduction,
                      fuel-efficiency improvements, and retrofit decisions before capital is
                      committed.
                    </p>
                    <div className="mt-4 min-w-0">
                      <Button href="/news/computational-fluid-dynamics" variant="primary">
                        Read article
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-pelagic-accent">{item.category}</span>
                  <span className="text-pelagic-copy-muted">{formatDate(item.date)}</span>
                </div>
                    <h2 className="font-display mt-3 min-w-0 break-words text-xl font-semibold text-pelagic-ink">
                      {item.title}
                    </h2>
                    <p className="type-copy mt-3 max-w-3xl min-w-0 break-words">
                      {item.excerpt}
                    </p>
                  </>
                )}
                  </div>
                </div>
              </article>
            </Reveal>
            );
          })}
        </div>
        <Reveal className="type-copy mt-10 text-center">
          More articles coming soon.{" "}
          <Link href="/contact" className="font-semibold text-pelagic-accent hover:underline">
            Contact us
          </Link>{" "}
          for press enquiries.
        </Reveal>
        </div>
      </SectionMaritime>
    </div>
  );
}
