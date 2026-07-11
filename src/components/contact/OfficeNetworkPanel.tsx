"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OfficeMap } from "@/components/ui/OfficeMap";
import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import {
  getGoogleMapsEmbedUrl,
  getGoogleMapsRegionalEmbedUrl,
  getGoogleMapsSearchUrl,
} from "@/lib/maps";
import {
  getHubOffices,
  getOfficeIndex,
  mapHubs,
  offices,
  type MapHubId,
  type Office,
} from "@/lib/offices";

type ViewMode = "network" | "office";

type OfficeNetworkPanelProps = {
  offices?: Office[];
  variant?: "compact" | "full";
  title?: string;
  description?: string;
  showContactLink?: boolean;
};

export function OfficeNetworkPanel({
  offices: officeList = offices,
  variant = "full",
  title = "Our global footprint",
  description = "India and the UAE — strategically placed for port attendance, surveys, and fleet support across the region.",
  showContactLink = true,
}: OfficeNetworkPanelProps) {
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("network");
  const [expandedHub, setExpandedHub] = useState<MapHubId | null>(null);

  const activeOffice = officeList[selectedOfficeIndex];

  useEffect(() => {
    for (const office of officeList) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = getGoogleMapsEmbedUrl(office);
      link.as = "document";
      document.head.appendChild(link);
    }
  }, [officeList]);

  function selectHub(hubId: MapHubId) {
    if (hubId === "india") {
      setExpandedHub("india");
      setViewMode("office");
      const indiaOffices = getHubOffices("india");
      const firstIndex = getOfficeIndex(indiaOffices[0].id);
      setSelectedOfficeIndex(firstIndex);
      return;
    }

    const dubaiIndex = getOfficeIndex("dubai");
    setExpandedHub(null);
    setSelectedOfficeIndex(dubaiIndex);
    setViewMode("office");
  }

  function selectOffice(office: Office) {
    setSelectedOfficeIndex(getOfficeIndex(office.id));
    setViewMode("office");
  }

  function backToHubs() {
    setExpandedHub(null);
    setViewMode("network");
  }

  const indiaOffices = getHubOffices("india");

  return (
    <div
      className={`card-maritime overflow-hidden rounded-2xl border shadow-sm ${
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
            onClick={() => {
              setViewMode("network");
              setExpandedHub(null);
            }}
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
            <ellipse
              cx="110"
              cy="115"
              rx="55"
              ry="70"
              fill="currentColor"
              opacity={expandedHub === "india" || activeOffice?.hubId === "india" ? 0.16 : 0.08}
              className="cursor-pointer"
              onClick={() => selectHub("india")}
            />
            <ellipse
              cx="250"
              cy="85"
              rx="28"
              ry="22"
              fill="currentColor"
              opacity={activeOffice?.hubId === "uae" ? 0.2 : 0.12}
              className="cursor-pointer"
              onClick={() => selectHub("uae")}
            />
            <circle
              cx="110"
              cy="110"
              r={expandedHub === "india" || activeOffice?.hubId === "india" ? 10 : 7}
              className={
                expandedHub === "india" || activeOffice?.hubId === "india"
                  ? "fill-pelagic-accent cursor-pointer"
                  : "fill-pelagic-accent cursor-pointer"
              }
              onClick={() => selectHub("india")}
            />
            <circle cx="110" cy="110" r="3" fill="white" className="pointer-events-none" />
            <circle
              cx="250"
              cy="85"
              r={activeOffice?.hubId === "uae" ? 10 : 7}
              className={
                activeOffice?.hubId === "uae"
                  ? "fill-pelagic-accent cursor-pointer"
                  : "fill-pelagic-accent cursor-pointer"
              }
              onClick={() => selectHub("uae")}
            />
            <circle cx="250" cy="85" r="3" fill="white" className="pointer-events-none" />
            <text x="95" y="175" fontSize="10" fill="currentColor" opacity="0.6">
              India
            </text>
            <text x="235" y="120" fontSize="10" fill="currentColor" opacity="0.6">
              UAE
            </text>
          </svg>
        </div>

        <ul className="mt-4 space-y-2">
          {expandedHub === "india" ? (
            <>
              <li>
                <button
                  type="button"
                  onClick={backToHubs}
                  className="mb-1 text-xs font-semibold uppercase tracking-wider text-pelagic-accent hover:text-pelagic-accent"
                >
                  ← Back to regions
                </button>
              </li>
              <li>
                <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-pelagic-steel">
                  India offices
                </p>
              </li>
              {indiaOffices.map((office) => {
                const index = getOfficeIndex(office.id);
                const isActive = viewMode === "office" && index === selectedOfficeIndex;

                return (
                  <li key={office.id}>
                    <button
                      type="button"
                      onClick={() => selectOffice(office)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-pelagic-accent bg-pelagic-accent/5"
                          : "border-pelagic-mist hover:border-pelagic-accent/30"
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                          isActive ? "bg-pelagic-accent" : "bg-pelagic-accent"
                        }`}
                      >
                        {office.label[0]}
                      </span>
                      <span className="min-w-0">
                        <span className="font-semibold text-pelagic-ink">{office.label}</span>
                        <span className="mt-0.5 block text-xs text-pelagic-steel">{office.address}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </>
          ) : (
            mapHubs.map((hub, index) => {
              const isActive =
                viewMode === "office" &&
                activeOffice &&
                activeOffice.hubId === hub.id &&
                hub.id !== "india";

              return (
                <li key={hub.id}>
                  <button
                    type="button"
                    onClick={() => selectHub(hub.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-pelagic-accent bg-pelagic-accent/5"
                        : "border-pelagic-mist hover:border-pelagic-accent/30"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                        isActive ? "bg-pelagic-accent" : "bg-pelagic-accent"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-pelagic-ink">{hub.label}</span>
                        {hub.id === "india" && (
                          <span className="rounded-full bg-pelagic-cream px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pelagic-steel">
                            2 offices
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-pelagic-steel">
                        {hub.id === "india" ? "Mumbai · Dehradun" : hub.region}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>

        {showContactLink && (
          <Link
            href="/contact#offices-map"
            className="mt-6 inline-flex text-sm font-semibold text-pelagic-accent hover:text-pelagic-accent"
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
            <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-2xl border border-pelagic-accent/20 bg-pelagic-cream/30 shadow-sm ring-1 ring-pelagic-accent/10 sm:min-h-[320px]">
              <GoogleMapEmbed
                src={getGoogleMapsRegionalEmbedUrl()}
                title="Pelagic Marine — India and UAE network"
                className="absolute inset-0 h-full w-full"
              />
            </div>
            <p className="mt-3 text-sm text-pelagic-steel">
              Tap India to see Mumbai and Dehradun, or select Dubai for UAE directions.
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
            Open {activeOffice.label} in Google Maps
          </a>
        )}
      </div>
    </div>
  );
}
