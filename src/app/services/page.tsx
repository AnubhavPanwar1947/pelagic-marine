import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { SectionMaritime } from "@/components/ui/SectionMaritime";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { serviceCategories } from "@/lib/site-data";
import { getServiceCategoryHref, getServiceItemHref } from "@/lib/service-slugs";
import "./services-theme.css";

const NAVAL_ARCHITECTURE_BLUEPRINT =
  "/images/owned/naval-architecture-blueprint.jpg";

const NAVAL_ARCHITECTURE_SLUG = "naval-architecture-design";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Naval architecture and design, marine engineering, inspection/audits/surveying, legal consultancy, mooring analysis and loadicator tools from Pelagic Marine Solutions.",
};

function ServiceCategoryLinks({
  service,
}: {
  service: (typeof serviceCategories)[number];
}) {
  return (
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
  );
}

function NavalArchitecturePracticeSection({
  service,
}: {
  service: (typeof serviceCategories)[number];
}) {
  const headingId = `${service.slug}-heading`;

  return (
    <section
      id={service.slug}
      className="services-practice-section scroll-mt-28"
      aria-labelledby={headingId}
    >
      <div className="services-practice-section__eyebrow">
        <span className="services-practice-section__badge" aria-hidden="true">
          01
        </span>
        <span className="services-practice-section__label">Practice section</span>
      </div>

      <div className="services-practice-section__grid grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="services-practice-section__main min-w-0 lg:col-span-4">
          <h2
            id={headingId}
            className="font-display type-subsection-title font-semibold text-[#0e235e]"
          >
            <Link
              href={getServiceCategoryHref(service.slug)}
              className="text-[#0e235e] transition hover:text-pelagic-accent"
            >
              {service.title}
            </Link>
          </h2>
          <p className="mt-4 text-sm leading-7 text-pelagic-steel">{service.summary}</p>
          <div
            className="services-practice-section__figure services-category-panel__figure relative mt-6 w-full max-w-full overflow-hidden aspect-[1024/602]"
          >
            <SiteImage
              src={NAVAL_ARCHITECTURE_BLUEPRINT}
              alt="Naval architecture technical blueprint showing hull elevations and deck plan"
              fill
              priority
              className="object-contain"
              sizes={imageSizes.serviceCategoryBlueprint}
            />
          </div>
        </div>

        <div className="services-practice-section__topics min-w-0 lg:col-span-8">
          <p className="services-practice-section__topics-heading text-sm text-pelagic-steel">
            Service topics · linked cards where a slug exists
          </p>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
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
    </section>
  );
}

export default function ServicesPage() {
  return (
    <div className="services-page">
      <PageHero
        eyebrow="Services"
        title="Practices built for the full vessel lifecycle"
        description="Concept design, structural analysis, surveys, audits, mooring studies and loading tools — the same engineering rigour, whichever practice you need."
      />

      <SectionMaritime className="py-24" gridOpacity={46}>
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {serviceCategories.map((service) => {
            if (service.slug === NAVAL_ARCHITECTURE_SLUG) {
              return (
                <NavalArchitecturePracticeSection key={service.slug} service={service} />
              );
            }

            return (
              <article
                key={service.slug}
                id={service.slug}
                className="card-maritime scroll-mt-28 overflow-hidden rounded-3xl border shadow-sm"
              >
                <div className="grid lg:grid-cols-12">
                  <div className="services-category-panel border-b border-pelagic-sand p-10 lg:col-span-4 lg:border-b-0 lg:border-r">
                    <h2 className="font-display type-subsection-title font-semibold text-[#0e235e]">
                      <Link
                        href={getServiceCategoryHref(service.slug)}
                        className="text-[#0e235e] transition hover:text-pelagic-accent"
                      >
                        {service.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-sm leading-7 text-pelagic-steel">
                      {service.summary}
                    </p>
                  </div>
                  <ServiceCategoryLinks service={service} />
                </div>
              </article>
            );
          })}
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
