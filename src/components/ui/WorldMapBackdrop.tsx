"use client";

import type { Office } from "@/lib/site-data";

type WorldMapBackdropProps = {
  offices: Office[];
  onSelectOffice?: (index: number) => void;
};

/** Full-hero gradient — Pelagic navy, accent blue, and sky tones from the logo. */
export function WorldMapBackdrop({ offices, onSelectOffice }: WorldMapBackdropProps) {
  void offices;
  void onSelectOffice;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="contact-hero-gradient absolute inset-0" />

      <div className="absolute -left-20 top-0 h-[70%] w-[55%] rounded-full bg-pelagic-sky/60 blur-3xl" />
      <div className="absolute right-0 top-[10%] h-[60%] w-[50%] rounded-full bg-pelagic-accent/25 blur-3xl" />
      <div className="absolute bottom-0 left-[30%] h-[45%] w-[45%] rounded-full bg-pelagic-light/30 blur-3xl" />
      <div className="absolute bottom-[10%] right-[20%] h-40 w-40 rounded-full bg-pelagic-water/25 blur-2xl" />

      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(20,48,110,0.6) 1.25px, transparent 1.25px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pelagic-accent/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-pelagic-accent/30 to-transparent" />
    </div>
  );
}
