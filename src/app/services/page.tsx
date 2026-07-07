import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceCategories } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Pelagic Marine Solutions offers marine surveying, naval architecture, engineering, LNG advisory, legal consultancy, and vessel operations support.",
};

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Services"
        title="Comprehensive marine and engineering consultancy"
        description="Expert-led services for ship owners, managers, charterers, insurers, and energy operators — available 24/7 from India and Dubai."
      />

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-24 sm:px-6 lg:px-8">
        {serviceCategories.map((service, index) => (
          <article
            key={service.slug}
            id={service.slug}
            className="scroll-mt-28 overflow-hidden rounded-3xl border border-pelagic-mist bg-white shadow-sm"
          >
            <div className="grid lg:grid-cols-12">
              <div className="bg-pelagic-charcoal p-10 text-white lg:col-span-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <ServiceIcon slug={service.slug} className="h-8 w-8" />
                </div>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-pelagic-gold-light">
                  Service {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="font-display mt-3 text-2xl font-semibold lg:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-300">
                  {service.summary}
                </p>
              </div>
              <div className="p-10 lg:col-span-8">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {service.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-2xl bg-pelagic-mist/50 px-5 py-4 text-sm text-slate-700"
                    >
                      <span className="mt-0.5 font-bold text-pelagic-gold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="bg-pelagic-charcoal py-24 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Need a tailored scope of work?
          </h2>
          <p className="mx-auto mt-5 text-lg text-slate-300">
            Our consultants assemble the right team for surveying, design, LNG
            operations, or legal support on your next project.
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
