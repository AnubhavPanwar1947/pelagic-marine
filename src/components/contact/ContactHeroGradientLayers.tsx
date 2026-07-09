"use client";

import type { ContactHeroShadeId } from "@/lib/contact-hero-shades";
import { isThemedHeroShade } from "@/lib/contact-hero-shades";

type ContactHeroGradientLayersProps = {
  shade: ContactHeroShadeId;
  className?: string;
};

/** Animated gradient mesh, glows, and wave bands for contact hero themes. */
export function ContactHeroGradientLayers({
  shade,
  className = "",
}: ContactHeroGradientLayersProps) {
  if (!isThemedHeroShade(shade)) return null;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className={`contact-hero-theme-mesh contact-hero-theme-mesh--${shade}`} />
      <div className={`contact-hero-theme-glow contact-hero-theme-glow--a contact-hero-theme-glow--${shade}`} />
      <div className={`contact-hero-theme-glow contact-hero-theme-glow--b contact-hero-theme-glow--${shade}`} />
      <div className={`contact-hero-theme-sweep contact-hero-theme-sweep--${shade}`} />
      <div className={`contact-hero-theme-wave contact-hero-theme-wave--${shade}`} />
      {shade === "blue-midnight" && (
        <>
          <div className="contact-hero-theme-star contact-hero-theme-star--1" />
          <div className="contact-hero-theme-star contact-hero-theme-star--2" />
          <div className="contact-hero-theme-star contact-hero-theme-star--3" />
        </>
      )}
      {shade === "teal-gold-dawn" && (
        <div className="contact-hero-theme-sun contact-hero-theme-sun--dawn" />
      )}
    </div>
  );
}
