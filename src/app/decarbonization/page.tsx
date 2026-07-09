import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SiteImage } from "@/components/ui/SiteImage";
import { decarbonization } from "@/lib/site-data";
import { siteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Decarbonization",
  description:
    "LNG, clean fuels, FuelEU, and decarbonisation advisory from Pelagic Marine Solutions.",
};

export default function DecarbonizationPage() {
  return (
    <div>
      <PageHero
        eyebrow="Decarbonization"
        title={decarbonization.headline}
        description={decarbonization.summary}
        imageSrc={siteImages.pageHeroes.decarbonization}
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-pelagic-sand bg-white shadow-sm">
            <div className="relative aspect-[21/9] sm:aspect-[3/1]">
              <SiteImage
                src={siteImages.decarbonization}
                alt="Offshore wind and clean energy"
                fill
                brandOverlay
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div className="bg-gradient-to-br from-pelagic-sky/50 to-pelagic-sunset/30 p-10 lg:p-14">
            <h2 className="font-display text-2xl font-semibold text-pelagic-ink">
              How we support the energy transition
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {decarbonization.points.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-2xl bg-white/80 p-5 text-sm text-pelagic-steel"
                >
                  <span className="font-bold text-pelagic-accent">→</span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-10 inline-flex rounded-full bg-pelagic-gold px-8 py-3 text-sm font-bold text-white shadow-md hover:bg-pelagic-gold-light"
            >
              Talk to our LNG & clean fuels team
            </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
