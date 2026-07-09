"use client";

import Link from "next/link";
import { useState } from "react";
import { OfficeMap } from "@/components/ui/OfficeMap";
import {
  getGoogleMapsRegionalEmbedUrl,
  getGoogleMapsSearchUrl,
} from "@/lib/maps";
import type { Office } from "@/lib/site-data";

type ViewMode = "network" | "office";

type OfficeNetworkPanelProps = {
  offices: Office[];
  variant?: "compact" | "full";
  title?: string;
  description?: string;
  showContactLink?: boolean;
};

export function OfficeNetworkPanel({
  offices,
  variant = "full",
  title = "Our global footprint",
  description = "India and the UAE — strategically placed for port attendance, surveys, and fleet support across the region.",
  showContactLink = true,
}: OfficeNetworkPanelProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("network");

  const activeOffice = offices[selectedIndex];

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-pelagic-mist bg-white shadow-sm ${
        variant === "compact" ? "" : "lg:grid lg:grid-cols-5"
      }`}
    >
      <div className={`p-6 sm:p-8 ${variant === "full" ? "lg:col-span-2 lg:border-r lg:border-pelagic-mist" : ""}`}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">
          Global presence
        </p>
        <h2 className="font-display mt-2 text-2xl font-semibold text-pelagic-ink sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-7 text-pelagic-steel">{description}</p>

        <div className="mt-6 inline-flex rounded-full border border-pelagic-mist bg-pelagic-cream/50 p-1">
          <button
            type="button"
            onClick={() => setViewMode("network")}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              viewMode === "network"
                ? "bg-pelagic-charcoal text-white"
                : "text-pelagic-steel hover:text-pelagic-charcoal"
            }`}
          >
            Network
          </button>
          <button
            type="button"
            onClick={() => setViewMode("office")}
            className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
              viewMode === "office"
                ? "bg-pelagic-charcoal text-white"
                : "text-pelagic-steel hover:text-pelagic-charcoal"
            }`}
          >
            Office
          </button>
        </div>

        <div className="mt-6" aria-hidden>
          <svg viewBox="0 0 320 200" className="w-full max-w-sm text-pelagic-accent/80">
            <path
              d="M40 120 Q120 40 200 90 T280 70"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              opacity="0.35"
            />
            <ellipse cx="110" cy="115" rx="55" ry="70" fill="currentColor" opacity="0.08" />
            <ellipse cx="250" cy="85" rx="28" ry="22" fill="currentColor" opacity="0.12" />
            {offices.map((office, index) => {
              const positions = [
                { cx: 95, cy: 95 },
                { cx: 125, cy: 130 },
                { cx: 250, cy: 85 },
              ];
              const pos = positions[index] ?? positions[0];
              const isActive = viewMode === "office" && index === selectedIndex;

              return (
                <g key={office.label}>
                  <circle
                    cx={pos.cx}
                    cy={pos.cy}
                    r={isActive ? 10 : 7}
                    className={isActive ? "fill-pelagic-gold" : "fill-pelagic-accent"}
                  />
                  <circle cx={pos.cx} cy={pos.cy} r="3" fill="white" />
                </g>
              );
            })}
            <text x="95" y="175" fontSize="10" fill="currentColor" opacity="0.6">
              India
            </text>
            <text x="235" y="120" fontSize="10" fill="currentColor" opacity="0.6">
              UAE
            </text>
          </svg>
        </div>

        <ul className="mt-4 space-y-2">
          {offices.map((office, index) => {
            const city = office.label.split("—").pop()?.trim() ?? office.label;
            const isActive = viewMode === "office" && index === selectedIndex;

            return (
              <li key={office.label}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index);
                    setViewMode("office");
                  }}
                  className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-pelagic-accent bg-pelagic-accent/5"
                      : "border-pelagic-mist hover:border-pelagic-accent/30"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isActive ? "bg-pelagic-gold" : "bg-pelagic-accent"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-pelagic-ink">{city}</span>
                      {office.hq && (
                        <span className="rounded-full bg-pelagic-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase text-pelagic-gold">
                          HQ
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-pelagic-steel">{office.region}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        {showContactLink && (
          <Link
            href="/contact#offices-map"
            className="mt-6 inline-flex text-sm font-semibold text-pelagic-accent hover:text-pelagic-gold"
          >
            Full Global Network Hub & directions →
          </Link>
        )}
      </div>

      <div className={`${variant === "full" ? "lg:col-span-3" : "mt-6"} p-6 sm:p-8`}>
        {viewMode === "network" ? (
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-pelagic-steel">
              India · UAE corridor
            </p>
            <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-2xl border border-pelagic-mist shadow-sm sm:min-h-[320px]">
              <iframe
                title="Pelagic Marine — India and UAE network"
                src={getGoogleMapsRegionalEmbedUrl()}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="office-map-frame absolute inset-0 h-full w-full border-0"
                allowFullScreen
              />
            </div>
            <p className="mt-3 text-sm text-pelagic-steel">
              Select an office on the left for a detailed street-level map and directions.
            </p>
          </div>
        ) : (
          <OfficeMap office={activeOffice} tall />
        )}

        {viewMode === "office" && (
          <a
            href={getGoogleMapsSearchUrl(activeOffice)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-lg border border-pelagic-mist px-4 py-2 text-sm font-semibold text-pelagic-charcoal hover:border-pelagic-accent/50"
          >
            Open {activeOffice.label.split("—").pop()?.trim()} in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
