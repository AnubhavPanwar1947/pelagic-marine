"use client";

import { SiteImage } from "@/components/ui/SiteImage";
import { siteImages } from "@/lib/site-images";

type HeroMediaProps = {
  className?: string;
  /** Full-bleed cinematic look (Enesel-style slow pan + dark overlay) */
  cinematic?: boolean;
};

/** Cache-bust when boss replaces the file under the same name */
const HERO_SRC = `${siteImages.hero}?v=brand-bridge-1`;

export function HeroMedia({ className = "", cinematic = false }: HeroMediaProps) {
  return (
    <div className={`relative overflow-hidden bg-pelagic-navy/10 ${className}`}>
      <div className={`absolute inset-0 ${cinematic ? "hero-ken-burns" : ""}`}>
        <SiteImage
          src={HERO_SRC}
          alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
          fill
          priority
          className={`object-cover object-center ${cinematic ? "scale-110" : ""}`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {cinematic ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-pelagic-navy/75 via-pelagic-navy/45 to-pelagic-navy/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-pelagic-ink/55 via-transparent to-pelagic-ink/25" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pelagic-cream to-transparent" />
        </>
      ) : (
        <>
          {/* Light edge blend only — keep the photo readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-pelagic-cream/55 via-transparent to-transparent lg:from-pelagic-cream/35" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        </>
      )}
    </div>
  );
}
