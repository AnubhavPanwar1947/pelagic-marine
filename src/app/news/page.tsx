import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { newsItems } from "@/lib/site-data";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Blog",
  description: "Latest articles and insights from Pelagic Marine Solutions.",
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
        eyebrow="Blog"
        title="Latest from Pelagic"
        description="Company updates, project highlights, and industry insights."
        imageSrc={siteImages.pageHeroes.news}
      />
      <SectionMaritime variant="mist" className="py-20" gridOpacity={48}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {newsItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 60}>
              <article className="card-premium card-maritime overflow-hidden rounded-3xl border shadow-sm">
                <div className="grid min-w-0 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
                  <div className="relative aspect-[16/10] min-w-0 overflow-hidden md:aspect-auto md:min-h-[10rem]">
                    <SiteImage
                      src={siteImages.news[i] ?? siteImages.news[0]}
                      alt={item.title}
                      fill
                      brandOverlay
                      objectPosition={getImageObjectPosition(
                        siteImages.news[i] ?? siteImages.news[0],
                      )}
                      className="object-cover"
                      sizes={imageSizes.newsCard}
                    />
                  </div>
                  <div className="min-w-0 p-8">
                <div className="flex min-w-0 flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-pelagic-accent">{item.category}</span>
                  <span className="text-pelagic-slate">{formatDate(item.date)}</span>
                </div>
                <h2 className="font-display mt-3 min-w-0 break-words text-xl font-semibold text-pelagic-ink">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pelagic-slate">
                  {item.excerpt}
                </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center text-sm text-pelagic-slate">
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
