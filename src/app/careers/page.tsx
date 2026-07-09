import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { careers, company } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join Pelagic Marine Solutions — careers for Master Mariners, marine engineers, and naval architects.",
};

export default function CareersPage() {
  return (
    <div>
      <PageHero
        eyebrow="Careers"
        title={careers.headline}
        description={careers.summary}
        imageSrc={siteImages.pageHeroes.careers}
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mb-12 aspect-[21/7] overflow-hidden rounded-3xl border border-pelagic-sand shadow-sm">
          <SiteImage
            src={siteImages.team}
            alt="Maritime professionals at work"
            fill
            brandOverlay
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
              Why join Pelagic
            </h2>
            <ul className="mt-6 space-y-4">
              {careers.perks.map((perk) => (
                <li
                  key={perk}
                  className="flex gap-3 rounded-2xl border border-pelagic-sand bg-white p-4 text-sm text-pelagic-steel"
                >
                  <span className="text-pelagic-gold">✓</span>
                  {perk}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-3xl border border-pelagic-sand bg-pelagic-sky/40 p-8">
              <h2 className="font-display text-xl font-semibold text-pelagic-ink">
                Apply now
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-pelagic-steel">
                Send your CV and a brief cover note. We review applications on a
                rolling basis for surveying, engineering, and advisory roles.
              </p>
              <a
                href={`mailto:${careers.applyEmail}?subject=Career%20application%20-%20Pelagic%20Marine`}
                className="mt-6 inline-flex rounded-full bg-pelagic-gold px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-pelagic-gold-light"
              >
                Email {careers.applyEmail}
              </a>
              <p className="mt-6 text-xs text-pelagic-slate">
                Offices: Mumbai · Dehradun (HQ) · Dubai · Founded {company.founded}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
