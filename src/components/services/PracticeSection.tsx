"use client";

import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import type { serviceCategories } from "@/lib/site-data";
import { getServiceItemHref } from "@/lib/service-slugs";

const NAVAL_ARCHITECTURE_BLUEPRINT =
  "/images/owned/naval-architecture-blueprint.jpg";

const NAVAL_ARCHITECTURE_SLUG = "naval-architecture-design";

const WHITE_PRACTICE_BAND_SLUGS = new Set([
  NAVAL_ARCHITECTURE_SLUG,
  "inspection-audits-surveying",
  "loadicator",
]);

const practiceVisuals: Record<
  string,
  {
    src: string;
    alt: string;
    variant: "photo";
    objectFit?: "contain" | "cover";
    objectPosition?: string;
    frameClassName?: string;
  }
> = {
  [NAVAL_ARCHITECTURE_SLUG]: {
    src: NAVAL_ARCHITECTURE_BLUEPRINT,
    alt: "Naval architecture technical blueprint showing hull elevations and deck plan",
    variant: "photo",
    objectFit: "contain",
  },
  engineering: {
    src: "/images/stock/engineer.jpeg",
    alt: "Engineering practice",
    variant: "photo",
    objectFit: "cover",
    objectPosition: "42% 48%",
    frameClassName: "bg-slate-900",
  },
  "inspection-audits-surveying": {
    src: "/images/stock/inspection.jpeg",
    alt: "Inspection, audits and surveying practice",
    variant: "photo",
    objectFit: "cover",
  },
  "mooring-compatibility": {
    src: "/images/stock/mooring.jpeg",
    alt: "Mooring and compatibility practice",
    variant: "photo",
    objectFit: "cover",
  },
  loadicator: {
    src: "/images/owned/loadicator.png",
    alt: "Loadicator practice",
    variant: "photo",
    objectFit: "contain",
  },
};

function chipRevealDelay(index: number) {
  const delay = index * 40;
  return delay <= 280 ? delay : 0;
}

function PracticeVisual({
  service,
}: {
  service: (typeof serviceCategories)[number];
}) {
  const visual = practiceVisuals[service.slug];
  if (!visual) return null;

  const fit = visual.objectFit ?? "contain";
  return (
    <div
      className={`services-practice-visual services-practice-visual--photo relative aspect-[1024/602] w-full overflow-hidden rounded-2xl ${visual.frameClassName ?? "bg-white"} services-practice-visual--${fit}`}
    >
      <SiteImage
        src={visual.src}
        alt={visual.alt}
        fill
        priority={service.slug === NAVAL_ARCHITECTURE_SLUG}
        className={fit === "cover" ? "object-cover" : "object-contain"}
        objectPosition={visual.objectPosition}
        sizes={imageSizes.serviceCategoryBlueprint}
      />
    </div>
  );
}

export function PracticeSection({
  service,
}: {
  service: (typeof serviceCategories)[number];
}) {
  const headingId = `${service.slug}-heading`;

  return (
    <section
      id={service.slug}
      className={`services-practice-band scroll-mt-28${WHITE_PRACTICE_BAND_SLUGS.has(service.slug) ? " services-practice-band--white" : ""}`}
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="services-practice-layout grid min-w-0 gap-8">
          <Reveal
            variant="text"
            className="services-practice-layout__header min-w-0"
          >
            <h2
              id={headingId}
              className="font-display type-subsection-title min-w-0 break-words font-semibold text-[#0e235e]"
            >
              {service.title}
            </h2>
            <p className="type-copy mt-3 max-w-3xl">{service.summary}</p>
          </Reveal>

          <Reveal
            variant="image"
            delay={80}
            className="services-practice-layout__visual min-w-0"
          >
            <PracticeVisual service={service} />
          </Reveal>

          <ul className="services-practice-topic-grid min-w-0 grid list-none gap-4 p-0">
            {service.items.map((item, index) => (
              <li key={item.slug} id={item.slug} className="scroll-mt-32 min-w-0">
                <Reveal variant="card" delay={chipRevealDelay(index)}>
                  <Link
                    href={getServiceItemHref(item)}
                    className="services-practice-topic-chip block min-h-full min-w-0 break-words no-underline"
                  >
                    <span className="services-practice-topic-chip__label block font-semibold text-[#0e235e]">
                      {item.label}
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
