"use client";

import { useEffect, useMemo, useState } from "react";
import { OfficeMap } from "@/components/ui/OfficeMap";
import { getGoogleMapsSearchUrl } from "@/lib/maps";
import { getOfficeLocalTime } from "@/lib/office-time";
import {
  getHubOffices,
  getOfficeIndex,
  mapHubs,
  type MapHubId,
  type Office,
  type OfficeRegion,
} from "@/lib/offices";
import { company } from "@/lib/site-data";

type RegionFilter = "All" | OfficeRegion;
type ViewMode = "split" | "map" | "list";

type OfficeLocatorProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
};

export function OfficeLocator({ offices, selectedIndex, onSelectOffice }: OfficeLocatorProps) {
  const [region, setRegion] = useState<RegionFilter>("All");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [expandedHub, setExpandedHub] = useState<MapHubId | null>(null);
  const [localTime, setLocalTime] = useState("");

  const activeOffice = offices[selectedIndex];

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

  const showHubList =
    region === "All" && !query.trim() && filtered.length === offices.length;

  useEffect(() => {
    function tick() {
      setLocalTime(getOfficeLocalTime(activeOffice));
    }
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [activeOffice]);

  function selectHub(hubId: MapHubId) {
    if (hubId === "india") {
      setExpandedHub("india");
      const firstIndia = getHubOffices("india")[0];
      onSelectOffice(getOfficeIndex(firstIndia.id));
      return;
    }
    setExpandedHub(null);
    onSelectOffice(getOfficeIndex("dubai"));
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by region">
          {(["All", "India", "UAE"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={region === tab}
              onClick={() => {
                setRegion(tab);
                setExpandedHub(null);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                region === tab
                  ? "bg-pelagic-accent text-white shadow-[0_4px_14px_rgba(38,106,174,0.25)]"
                  : "border border-pelagic-mist bg-white/80 text-pelagic-steel hover:border-pelagic-accent/60 hover:bg-white"
              }`}
            >
              {tab === "All" ? "Global" : tab}
            </button>
          ))}
        </div>

        <div
          className="inline-flex rounded-full border border-pelagic-mist bg-white/90 p-1 shadow-sm"
          role="tablist"
          aria-label="Map or list view"
        >
          {(
            [
              { id: "split" as const, label: "Split" },
              { id: "map" as const, label: "Map" },
              { id: "list" as const, label: "List" },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={viewMode === mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                viewMode === mode.id
                  ? "bg-pelagic-charcoal text-white"
                  : "text-pelagic-steel hover:text-pelagic-charcoal"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="office-locator-search" className="sr-only">
          Search our global network of offices
        </label>
        <input
          id="office-locator-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim()) setExpandedHub(null);
          }}
          placeholder="Search city, country, or address…"
          className="w-full rounded-2xl border border-pelagic-mist bg-white/90 px-5 py-4 text-sm text-pelagic-charcoal placeholder:text-pelagic-slate outline-none shadow-sm backdrop-blur-sm transition focus:border-pelagic-accent/70 focus:ring-2 focus:ring-pelagic-accent/15"
        />
      </div>

      <div
        className={`grid gap-8 ${
          viewMode === "split" ? "lg:grid-cols-5 lg:gap-10" : "grid-cols-1"
        }`}
      >
        {(viewMode === "split" || viewMode === "list") && (
          <div className={`space-y-4 ${viewMode === "split" ? "lg:col-span-2" : ""}`}>
            {showHubList && expandedHub !== "india" ? (
              mapHubs.map((hub) => (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => selectHub(hub.id)}
                  className="w-full rounded-2xl border border-pelagic-mist/80 bg-white/70 p-5 text-left transition hover:border-pelagic-accent/40 hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pelagic-accent/90 text-sm font-bold text-white shadow-sm">
                      {hub.id === "india" ? "IN" : "AE"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-pelagic-charcoal">{hub.label}</h3>
                        {hub.id === "india" && (
                          <span className="rounded-full bg-pelagic-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pelagic-steel">
                            2 offices
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-pelagic-slate">
                        {hub.id === "india" ? "Mumbai · Dehradun" : hub.region}
                      </p>
                      <span className="mt-2 inline-flex text-sm font-semibold text-pelagic-accent">
                        {hub.id === "india" ? "View offices →" : "View on map →"}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            ) : filtered.length === 0 ? (
              <p className="text-sm text-pelagic-slate">
                No offices match. Try another region or search.
              </p>
            ) : (
              <>
                {showHubList && expandedHub === "india" && (
                  <button
                    type="button"
                    onClick={() => setExpandedHub(null)}
                    className="text-xs font-semibold uppercase tracking-wider text-pelagic-accent hover:text-pelagic-accent"
                  >
                    ← Back to regions
                  </button>
                )}
                {(showHubList && expandedHub === "india"
                  ? filtered.filter(({ office }) => office.hubId === "india")
                  : filtered
                ).map(({ office, index }) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={office.id}
                      type="button"
                      onClick={() => onSelectOffice(index)}
                      className={`w-full rounded-2xl border p-5 text-left transition ${
                        isSelected
                          ? "border-pelagic-accent/70 bg-white shadow-[0_8px_24px_rgba(38,106,174,0.12)] ring-2 ring-pelagic-accent/20"
                          : "border-pelagic-mist/80 bg-white/70 hover:border-pelagic-accent/40 hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pelagic-accent/90 text-sm font-bold text-white shadow-sm">
                          {office.label[0]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-pelagic-charcoal">{office.label}</h3>
                            <span className="text-xs text-pelagic-steel">{office.region}</span>
                          </div>
                          {office.tagline && (
                            <p className="mt-1 text-xs font-medium text-pelagic-accent">
                              {office.tagline}
                            </p>
                          )}
                          <p className="mt-2 text-sm leading-6 text-pelagic-slate">{office.address}</p>
                          {office.hours && (
                            <p className="mt-1 text-xs text-pelagic-slate">{office.hours}</p>
                          )}
                          <p className="mt-2 text-sm text-pelagic-steel">
                            <a
                              href={`tel:${office.phone.replace(/\s/g, "")}`}
                              onClick={(e) => e.stopPropagation()}
                              className="hover:text-pelagic-accent hover:underline"
                            >
                              {office.phone}
                            </a>
                          </p>
                          <span
                            className="mt-2 inline-flex text-sm font-semibold text-pelagic-accent"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                getGoogleMapsSearchUrl(office),
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                            role="link"
                          >
                            Open in Google Maps →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}

        {(viewMode === "split" || viewMode === "map") && (
          <div className={viewMode === "split" ? "lg:col-span-3" : ""}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-pelagic-sand bg-white/80 px-4 py-2.5 text-sm">
              <p className="font-semibold text-pelagic-ink">
                {activeOffice.region === "India"
                  ? `India — ${activeOffice.label}`
                  : activeOffice.label}
              </p>
              <p className="text-pelagic-steel">
                Local time: <span className="font-semibold text-pelagic-accent">{localTime}</span>
              </p>
            </div>
            <OfficeMap key={activeOffice.id} office={activeOffice} tall />
            <a
              href={getGoogleMapsSearchUrl(activeOffice)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex text-sm font-bold text-pelagic-accent hover:text-pelagic-accent hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-pelagic-slate">
        {company.legalName} · Global Network Hub · India (Mumbai & Dehradun) · Dubai
      </p>
    </div>
  );
}
