"use client";

import type { Office } from "@/lib/site-data";

type WorldMapBackdropProps = {
  offices: Office[];
  onSelectOffice?: (index: number) => void;
};

/** Full-hero vibrant gradient — Pelagic sky, teal, water, gold. */
export function WorldMapBackdrop({ offices, onSelectOffice }: WorldMapBackdropProps) {
  void offices;
  void onSelectOffice;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="contact-hero-gradient absolute inset-0" />

      {/* Soft light pools — depth across entire hero */}
      <div className="absolute -left-20 top-0 h-[70%] w-[55%] rounded-full bg-sky-200/50 blur-3xl" />
      <div className="absolute right-0 top-[10%] h-[60%] w-[50%] rounded-full bg-teal-300/35 blur-3xl" />
      <div className="absolute bottom-0 left-[30%] h-[45%] w-[45%] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute bottom-[10%] right-[20%] h-40 w-40 rounded-full bg-cyan-300/30 blur-2xl" />

      {/* Subtle maritime grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15,118,110,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pelagic-gold/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pelagic-accent/30 to-transparent" />
    </div>
  );
}
