import type { Metadata } from "next";
import Link from "next/link";
import { OfficeNetworkPanel } from "@/components/contact/OfficeNetworkPanel";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { company } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "About",
  description:
    "Pelagic Marine Solutions is a naval architecture and marine engineering consultancy serving maritime, offshore, oil & gas and renewables clients worldwide.",
};

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About"
        title="Engineering depth, data and design — from Dubai to fleets worldwide"
        description="Pelagic Marine Solutions is a naval architecture and marine engineering consultancy. We exist to solve the problems most firms only survey."
        imageSrc={siteImages.pageHeroes.about}
      />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Who we are" title="Built around engineering, analysis and design" />
        <p className="mt-6 max-w-3xl text-base leading-8 text-pelagic-steel">
          Founded on a clear idea — that engineering, analysis and design should sit at the centre of
          marine consultancy, not at its edge — Pelagic Marine Solutions brings naval architects and
          Master Mariners together under one roof. We work across maritime, offshore, oil &amp; gas and
          renewables, combining licensed analysis tools with decades of sea-going and project experience.
        </p>
      </section>

      <section className="bg-pelagic-cream py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Our mission",
                text: "To solve marine engineering problems with depth, data and design — giving owners, operators and charterers decisions they can stand behind.",
              },
              {
                title: "Our vision",
                text: "A consultancy where naval architecture and sea-going experience meet — setting the standard for technically rigorous, independent marine advisory.",
              },
              {
                title: "What we hold to",
                text: "Integrity in what we report. Engineering rigour in how we reach it. Practical judgement from time at sea. And a commitment to sustainable development.",
              },
            ].map((card) => (
              <article
                key={card.title}
                className="rounded-3xl border border-pelagic-mist bg-white p-8 shadow-sm"
              >
                <h3 className="font-display text-xl font-semibold text-pelagic-ink">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-pelagic-steel">{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pelagic-charcoal py-20 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-gold">Our principle</p>
          <h2 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
            Sustainable development through innovation and integrity.
          </h2>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Clients" title="Who we work with" />
            <p className="mt-6 leading-8 text-pelagic-steel">
              Owners, operators, charterers, P&amp;I interests, insurers and offshore developers across
              the industry.
            </p>
            <Link
              href="/team"
              className="mt-8 inline-flex rounded-full bg-pelagic-charcoal px-6 py-3 text-sm font-bold text-white hover:bg-pelagic-ink"
            >
              Meet the team →
            </Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-pelagic-mist shadow-sm">
            <SiteImage
              src={siteImages.expertise}
              alt="Container port and maritime operations"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <OfficeNetworkPanel
            offices={company.offices}
            title="India · Dubai"
            description="Tap India to see Mumbai and Dehradun, or select Dubai for UAE directions."
          />
        </div>
      </section>
    </div>
  );
}
