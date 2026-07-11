import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceCategories } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Naval architecture and design, marine engineering, inspection/audits/surveying, and legal consultancy from Pelagic Marine Solutions.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Four practices, one engineering standard"
        description="Concept design, structural analysis, surveys, audits and clean-fuel advisory — the same engineering rigour, whichever practice you need."
        imageSrc={siteImages.pageHeroes.services}
      />

      <SectionMaritime className="py-24" gridOpacity={46}>
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
        {serviceCategories.map((service, index) => (
          <article
            key={service.slug}
            id={service.slug}
            className="card-maritime scroll-mt-28 overflow-hidden rounded-3xl border shadow-sm"
          >
            <div className="grid lg:grid-cols-12">
              <div className="bg-pelagic-charcoal p-10 text-white lg:col-span-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <ServiceIcon slug={service.slug} className="h-8 w-8" />
                </div>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-pelagic-light">
                  {String(index + 1).padStart(2, "0")} / Practice
                </p>
                <h2 className="font-display mt-3 text-2xl font-semibold lg:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">{service.summary}</p>
              </div>
              <div className="p-10 lg:col-span-8">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li
                      key={item.slug}
                      id={item.slug}
                      className="card-maritime flex scroll-mt-32 flex-col gap-1 rounded-2xl border px-5 py-4 text-sm text-slate-700"
                    >
                      <span className="font-semibold text-pelagic-ink">{item.label}</span>
                      {item.teaser && (
                        <span className="text-xs text-pelagic-steel">{item.teaser}</span>
                      )}
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
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
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
