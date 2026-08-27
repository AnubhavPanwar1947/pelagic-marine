import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { serviceCategories } from "@/lib/site-data";
import { getServiceCategoryHref, getServiceItemHref } from "@/lib/service-slugs";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Naval architecture and design, marine engineering, inspection/audits/surveying, legal consultancy, mooring analysis and loadicator tools from Pelagic Marine Solutions.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Practices built for the full vessel lifecycle"
        description="Concept design, structural analysis, surveys, audits, mooring studies and loading tools — the same engineering rigour, whichever practice you need."
        imageSrc={siteImages.pageHeroes.services}
      />

      <SectionMaritime className="py-24" gridOpacity={46}>
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {serviceCategories.map((service) => (
            <article
              key={service.slug}
              id={service.slug}
              className="card-maritime scroll-mt-28 overflow-hidden rounded-3xl border shadow-sm"
            >
              <div className="grid lg:grid-cols-12">
                <div className="bg-pelagic-charcoal p-10 text-white lg:col-span-4">
                  <h2 className="font-display type-subsection-title font-semibold">
                    <Link
                      href={getServiceCategoryHref(service.slug)}
                      className="transition hover:text-pelagic-accent"
                    >
                      {service.title}
                    </Link>
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{service.summary}</p>
                </div>
                <div className="p-10 lg:col-span-8">
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {service.items.map((item) => (
                      <li key={item.slug} id={item.slug} className="scroll-mt-32">
                        <Link
                          href={getServiceItemHref(item)}
                          className="card-maritime flex h-full flex-col gap-1 rounded-2xl border px-5 py-4 text-sm text-slate-700 transition hover:border-pelagic-accent/40 hover:shadow-sm"
                        >
                          <span className="font-semibold text-pelagic-ink">{item.label}</span>
                          {item.teaser && (
                            <span className="text-xs text-pelagic-steel">{item.teaser}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionMaritime>

      <section className="bg-pelagic-charcoal py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display type-subsection-title--lg font-semibold">
            Need a tailored scope of work?
          </h2>
          <p className="mx-auto mt-5 text-lg text-slate-300">
            Tell us the vessel, structure or survey — we will assemble the right practice and expert.
          </p>
          <div className="mt-10">
            <Button href="/contact" variant="primary">
              Contact our team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
