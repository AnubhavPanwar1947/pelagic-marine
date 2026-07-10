"use client";

/** Static hero highlights — no animation/blur for smoother scrolling. */
export function ContactHeroAmbience() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      <div className="contact-hero-gradient-shift absolute inset-0 opacity-50" />
    </div>
  );
}
