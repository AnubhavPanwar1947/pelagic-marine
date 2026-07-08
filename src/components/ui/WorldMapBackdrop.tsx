"use client";

import Image from "next/image";
import type { Office } from "@/lib/site-data";

function latLngToPercent(lat: number, lng: number) {
  return {
    left: `${((lng + 180) / 360) * 100}%`,
    top: `${((90 - lat) / 180) * 100}%`,
  };
};

type WorldMapBackdropProps = {
  offices: Office[];
  onSelectOffice?: (index: number) => void;
};

export function WorldMapBackdrop({ offices, onSelectOffice }: WorldMapBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-contact-hero" />

      <Image
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2400&q=80"
        alt=""
        fill
        priority
        className="object-cover opacity-[0.09] saturate-[0.6] mix-blend-multiply"
        sizes="100vw"
      />

      <div className="contact-hero-glow pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-pelagic-gold-light/35 blur-3xl" />
      <div className="contact-hero-glow pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-pelagic-water/40 blur-3xl" />

      <div className="absolute inset-0 bg-gradient-to-r from-pelagic-cream/70 via-transparent to-pelagic-sky/25 lg:from-pelagic-cream/50" />

      {offices.map((office, index) => {
        const pos = latLngToPercent(office.coordinates.lat, office.coordinates.lng);
        const label = office.label.split("—").pop()?.trim() ?? office.label;

        return (
          <button
            key={office.label}
            type="button"
            style={{ left: pos.left, top: pos.top }}
            onClick={() => onSelectOffice?.(index)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2"
            title={office.label}
          >
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-pelagic-gold/25 opacity-70 group-hover:animate-ping" />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-pelagic-gold text-sm font-bold text-white shadow-[0_4px_16px_rgba(201,148,26,0.35)] transition group-hover:scale-110">
                {index + 1}
              </span>
            </span>
            <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-pelagic-mist bg-white/95 px-2.5 py-1 text-xs font-semibold text-pelagic-charcoal opacity-0 shadow-md transition group-hover:opacity-100">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
