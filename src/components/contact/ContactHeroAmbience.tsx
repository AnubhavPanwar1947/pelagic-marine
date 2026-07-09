"use client";

/** Extra shimmer across full hero gradient. */
export function ContactHeroAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      <div className="contact-hero-gradient-shift absolute inset-0 opacity-70" />
      <div className="absolute left-[20%] top-[35%] h-40 w-40 rounded-full bg-amber-200/30 blur-3xl" />
      <div className="absolute right-[25%] top-[20%] h-36 w-36 rounded-full bg-pelagic-gold-light/35 blur-2xl" />
      <div className="absolute bottom-[15%] left-[45%] h-28 w-28 rounded-full bg-yellow-100/40 blur-2xl" />
    </div>
  );
}
