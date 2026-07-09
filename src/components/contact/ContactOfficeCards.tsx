"use client";

import { useEffect, useState } from "react";
import { getGoogleMapsSearchUrl } from "@/lib/maps";
import { getOfficeLocalTime } from "@/lib/office-time";
import type { Office } from "@/lib/site-data";
import { SiteImage } from "@/components/ui/SiteImage";
import { siteImages } from "@/lib/site-images";

type ContactOfficeCardsProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
  onViewMap: () => void;
};

const regionTheme: Record<Office["region"], { badge: string }> = {
  India: { badge: "🇮🇳" },
  UAE: { badge: "🇦🇪" },
};

const officeStats = [
  "Western India mobilisation",
  "Global HQ · Engineering hub",
  "Middle East operations",
] as const;

/** Distinct top accent per office — Mumbai · Dehradun · Dubai */
const officeTopAccent = [
  {
    bar: "bg-gradient-to-r from-cyan-600 via-teal-500 to-emerald-500",
    overlay: "from-cyan-950/85 via-teal-900/45 to-transparent",
  },
  {
    bar: "bg-gradient-to-r from-amber-600 via-pelagic-gold to-yellow-500",
    overlay: "from-amber-950/80 via-yellow-900/40 to-transparent",
  },
  {
    bar: "bg-gradient-to-r from-orange-500 via-amber-500 to-amber-300",
    overlay: "from-orange-950/85 via-amber-900/45 to-transparent",
  },
] as const;

export function ContactOfficeCards({
  offices,
  selectedIndex,
  onSelectOffice,
  onViewMap,
}: ContactOfficeCardsProps) {
  const [localTimes, setLocalTimes] = useState<string[]>([]);

  useEffect(() => {
    function tick() {
      setLocalTimes(offices.map((office) => getOfficeLocalTime(office)));
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [offices]);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {offices.map((office, index) => {
        const city = office.label.split("—").pop()?.trim() ?? office.label;
        const cityUpper = city.replace("(HQ)", "").trim().toUpperCase();
        const isSelected = index === selectedIndex;
        const region = regionTheme[office.region];
        const imageSrc = siteImages.offices[index] ?? siteImages.contactHero;

        const accent = officeTopAccent[index];

        return (
          <article
            key={office.label}
            className={`card-premium group relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
              isSelected
                ? "border-pelagic-gold ring-2 ring-pelagic-gold/35"
                : "border-pelagic-sand hover:border-pelagic-accent/30"
            }`}
          >
            <div className={`h-2.5 w-full ${accent.bar}`} aria-hidden />
            <div className="relative h-40 overflow-hidden">
              <SiteImage
                src={imageSrc}
                alt={`${city} office`}
                fill
                brandOverlay
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${accent.overlay}`} />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-10 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        {region.badge}
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/80">
                        {office.region}
                      </p>
                    </div>
                    <h3 className="font-display mt-2 text-3xl font-bold tracking-wide sm:text-[2rem]">
                      {cityUpper}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/70">
                      {officeStats[index]}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-sm font-bold tabular-nums backdrop-blur-sm ${
                        isSelected ? "bg-pelagic-gold/90 text-pelagic-charcoal" : ""
                      }`}
                    >
                      0{index + 1}
                    </span>
                    {office.hq && (
                      <span className="rounded-full bg-pelagic-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-pelagic-charcoal shadow-md">
                        Headquarters
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-6">
              {office.tagline && (
                <p className="text-sm font-semibold leading-6 text-pelagic-accent">{office.tagline}</p>
              )}

              {office.services && office.services.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {office.services.map((service) => (
                    <li
                      key={service}
                      className="rounded-lg bg-gradient-to-r from-teal-50 to-pelagic-sky/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-teal-900"
                    >
                      {service}
                    </li>
                  ))}
                </ul>
              )}

              <address className="mt-5 flex-1 not-italic text-sm leading-6 text-pelagic-slate">
                {office.address}
              </address>

              {office.hours && (
                <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {office.hours}
                  {localTimes[index] && (
                    <span className="normal-case text-emerald-700">· Local {localTimes[index]}</span>
                  )}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-pelagic-charcoal px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-pelagic-ink"
                >
                  <PhoneIcon />
                  Call office
                </a>
                <button
                  type="button"
                  onClick={() => {
                    onSelectOffice(index);
                    onViewMap();
                  }}
                  className={`rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
                    isSelected
                      ? "bg-pelagic-gold text-pelagic-charcoal shadow-md hover:bg-pelagic-gold-light"
                      : "border-2 border-pelagic-sand text-pelagic-charcoal hover:border-pelagic-gold hover:text-pelagic-gold"
                  }`}
                >
                  {isSelected ? "Selected · Map" : "View on map"}
                </button>
              </div>
              <a
                href={getGoogleMapsSearchUrl(office)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-xs font-semibold text-pelagic-accent underline-offset-4 hover:text-pelagic-gold hover:underline"
              >
                Open directions
              </a>
            </div>

            <button type="button" onClick={() => onSelectOffice(index)} className="sr-only">
              Select {office.label} office
            </button>

            <div
              className={`h-1.5 w-full transition-all duration-300 ${
                isSelected ? "bg-gradient-to-r from-pelagic-gold via-amber-400 to-pelagic-gold" : "bg-transparent"
              }`}
              aria-hidden
            />
          </article>
        );
      })}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0 text-pelagic-gold" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
  );
}
