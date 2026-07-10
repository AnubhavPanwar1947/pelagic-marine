"use client";

import { useMemo, useState } from "react";
import { getGoogleMapsSearchUrl } from "@/lib/maps";
import type { Office } from "@/lib/site-data";

type OfficeNetworkSearchProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
};

export function OfficeNetworkSearch({
  offices,
  selectedIndex,
  onSelectOffice,
}: OfficeNetworkSearchProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return offices.map((office, index) => ({ office, index }));

    return offices
      .map((office, index) => ({ office, index }))
      .filter(
        ({ office }) =>
          office.label.toLowerCase().includes(q) ||
          office.address.toLowerCase().includes(q) ||
          office.mapQuery.toLowerCase().includes(q)
      );
  }, [offices, query]);

  return (
    <div>
      <label htmlFor="office-search" className="sr-only">
        Search our global network of offices
      </label>
      <input
        id="office-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city, country, or address…"
        className="w-full rounded-2xl border border-pelagic-mist bg-white px-5 py-4 text-sm outline-none transition focus:border-pelagic-gold focus:ring-2 focus:ring-pelagic-gold/20"
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
            No offices match your search. Try India or Dubai.
          </p>
        ) : (
          filtered.map(({ office, index }) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={office.label}
                type="button"
                onClick={() => onSelectOffice(index)}
                className={`rounded-2xl border p-5 text-left transition ${
                  isSelected
                    ? "border-pelagic-gold bg-pelagic-sand/60 shadow-md ring-2 ring-pelagic-gold/30"
                    : "border-pelagic-mist bg-white hover:border-pelagic-gold/50"
                }`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pelagic-charcoal text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-pelagic-charcoal">{office.label}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{office.address}</p>
                <span
                  className="mt-3 inline-flex text-sm font-semibold text-pelagic-steel"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(getGoogleMapsSearchUrl(office), "_blank", "noopener,noreferrer");
                  }}
                  role="link"
                >
                  Directions →
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
