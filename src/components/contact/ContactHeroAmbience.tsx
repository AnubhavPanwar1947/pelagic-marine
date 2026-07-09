"use client";

/** Extra shimmer across full hero gradient. */
export function ContactHeroAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      <div className="contact-hero-gradient-shift absolute inset-0 opacity-60" />
      <div className="absolute left-[25%] top-[40%] h-32 w-32 rounded-full bg-white/25 blur-2xl" />
      <div className="absolute right-[30%] top-[25%] h-24 w-24 rounded-full bg-pelagic-gold-light/20 blur-xl" />
    </div>
  );
}
