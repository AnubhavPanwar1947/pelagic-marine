import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { newsItems } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and insights from Pelagic Marine Solutions.",
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
        eyebrow="News & insights"
        title="Latest from Pelagic"
        description="Company updates, project highlights, and industry insights."
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {newsItems.map((item, i) => (
            <Reveal key={item.slug} delay={i * 60}>
              <article className="card-premium rounded-3xl border border-pelagic-sand bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
                  <span className="text-pelagic-gold">{item.category}</span>
                  <span className="text-pelagic-slate">{formatDate(item.date)}</span>
                </div>
                <h2 className="font-display mt-3 text-xl font-semibold text-pelagic-ink">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-pelagic-slate">
                  {item.excerpt}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center text-sm text-pelagic-slate">
          More articles coming soon.{" "}
          <Link href="/contact" className="font-semibold text-pelagic-gold hover:underline">
            Contact us
          </Link>{" "}
          for press enquiries.
        </Reveal>
      </section>
    </div>
  );
}
