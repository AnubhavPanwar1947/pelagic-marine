"use client";

import { useMemo, useState } from "react";
import { OfficeMap } from "@/components/ui/OfficeMap";
import { getGoogleMapsSearchUrl } from "@/lib/maps";
import type { Office, OfficeRegion } from "@/lib/site-data";
import { company } from "@/lib/site-data";

type RegionFilter = "All" | OfficeRegion;

type OfficeLocatorProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
};

export function OfficeLocator({ offices, selectedIndex, onSelectOffice }: OfficeLocatorProps) {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return offices
      .map((office, index) => ({ office, index }))
      .filter(({ office }) => {
        const matchesRegion = region === "All" || office.region === region;
        const q = query.trim().toLowerCase();
        const matchesQuery =
          !q ||
          office.label.toLowerCase().includes(q) ||
          office.address.toLowerCase().includes(q) ||
          office.mapQuery.toLowerCase().includes(q);
        return matchesRegion && matchesQuery;
      });
  }, [offices, region, query]);

  const activeOffice = offices[selectedIndex];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by region">
        {(["All", "India", "UAE"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={region === tab}
            onClick={() => setRegion(tab)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              region === tab
                ? "bg-pelagic-gold text-white shadow-[0_4px_14px_rgba(201,148,26,0.25)]"
                : "border border-pelagic-mist bg-white/80 text-pelagic-steel hover:border-pelagic-gold/60 hover:bg-white"
            }`}
          >
            {tab === "All" ? "Global" : tab}
          </button>
        ))}
      </div>

      <div>
        <label htmlFor="office-locator-search" className="sr-only">
          Search our global network of offices
        </label>
        <input
          id="office-locator-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, country, or address…"
          className="w-full rounded-2xl border border-pelagic-mist bg-white/90 px-5 py-4 text-sm text-pelagic-charcoal placeholder:text-pelagic-slate outline-none shadow-sm backdrop-blur-sm transition focus:border-pelagic-gold/70 focus:ring-2 focus:ring-pelagic-gold/15"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="space-y-4 lg:col-span-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-pelagic-slate">No offices match. Try another region or search.</p>
          ) : (
            filtered.map(({ office, index }) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={office.label}
                  type="button"
                  onClick={() => onSelectOffice(index)}
                  className={`w-full rounded-2xl border p-5 text-left transition ${
                    isSelected
                      ? "border-pelagic-gold/70 bg-white shadow-[0_8px_24px_rgba(201,148,26,0.12)] ring-2 ring-pelagic-gold/20"
                      : "border-pelagic-mist/80 bg-white/70 hover:border-pelagic-gold/40 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pelagic-gold/90 text-sm font-bold text-white shadow-sm">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-pelagic-charcoal">{office.label}</h3>
                        {office.hq && (
                          <span className="rounded-full bg-pelagic-gold/15 px-2 py-0.5 text-xs font-bold uppercase text-pelagic-gold">
                            HQ
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-pelagic-slate">{office.address}</p>
                      <p className="mt-2 text-sm text-pelagic-steel">
                        <a
                          href={`tel:${office.phone.replace(/\s/g, "")}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:text-pelagic-gold hover:underline"
                        >
                          {office.phone}
                        </a>
                      </p>
                      <span
                        className="mt-2 inline-flex text-sm font-semibold text-pelagic-accent"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(getGoogleMapsSearchUrl(office), "_blank", "noopener,noreferrer");
                        }}
                        role="link"
                      >
                        Open in Google Maps →
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-3">
          <OfficeMap key={activeOffice.label} office={activeOffice} tall />
        </div>
      </div>

      <p className="text-center text-sm text-pelagic-slate">
        {company.legalName} · {offices.length} offices across India and the UAE · Response typically
        within one business day
      </p>
    </div>
  );
}
