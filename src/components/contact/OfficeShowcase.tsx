"use client";

import { getGoogleMapsSearchUrl } from "@/lib/maps";
import type { Office } from "@/lib/site-data";

type OfficeShowcaseProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
  onViewMap: () => void;
};

const regionStyle: Record<
  Office["region"],
  { accent: string; badge: string; welcome: string }
> = {
  India: {
    accent: "from-pelagic-accent to-teal-600",
    badge: "bg-pelagic-accent/10 text-pelagic-accent",
    welcome: "Our India team is ready to support you across ports and projects nationwide.",
  },
  UAE: {
    accent: "from-pelagic-gold to-amber-600",
    badge: "bg-pelagic-gold/12 text-pelagic-gold",
    welcome: "Our Dubai office connects you to Middle East operations with local presence.",
  },
};

export function OfficeShowcase({
  offices,
  selectedIndex,
  onSelectOffice,
  onViewMap,
}: OfficeShowcaseProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {offices.map((office, index) => {
        const city = office.label.split("—").pop()?.trim() ?? office.label;
        const isSelected = index === selectedIndex;
        const style = regionStyle[office.region];

        return (
          <article
            key={office.label}
            className={`contact-content-bright card-premium group flex h-full flex-col overflow-hidden rounded-2xl border transition ${
              isSelected
                ? "border-pelagic-gold/60 shadow-[0_16px_48px_-12px_rgba(201,148,26,0.22)] ring-2 ring-pelagic-gold/25"
                : "border-white/90 hover:border-pelagic-gold/35 hover:shadow-lg"
            }`}
          >
            <div className={`h-1.5 w-full bg-gradient-to-r ${style.accent}`} />

            <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-3xl font-semibold text-pelagic-sand/90">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-wrap justify-end gap-2">
                  {office.hq && (
                    <span className="rounded-full bg-pelagic-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      HQ
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${style.badge}`}
                  >
                    {office.region}
                  </span>
                </div>
              </div>

              <h3 className="font-display mt-4 text-2xl font-semibold text-pelagic-ink">{city}</h3>
              {office.tagline && (
                <p className="mt-2 text-sm leading-6 text-pelagic-steel">{office.tagline}</p>
              )}

              <p className="mt-4 rounded-xl bg-pelagic-sand/60 px-4 py-3 text-sm leading-6 text-pelagic-charcoal">
                {style.welcome}
              </p>

              <p className="mt-4 text-sm leading-6 text-pelagic-slate">{office.address}</p>
              {office.hours && (
                <p className="mt-2 text-xs font-medium text-pelagic-steel">{office.hours}</p>
              )}

              <p className="mt-3 text-sm">
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-pelagic-accent hover:text-pelagic-gold"
                >
                  {office.phone}
                </a>
              </p>

              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    onSelectOffice(index);
                    onViewMap();
                  }}
                  className="rounded-full bg-pelagic-charcoal px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-pelagic-ink"
                >
                  View on map
                </button>
                <a
                  href={getGoogleMapsSearchUrl(office)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-pelagic-mist px-4 py-2.5 text-xs font-semibold text-pelagic-charcoal transition hover:border-pelagic-gold/50 hover:text-pelagic-gold"
                >
                  Directions
                </a>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
