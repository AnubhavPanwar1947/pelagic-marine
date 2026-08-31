"use client";

import { GoogleMapEmbed } from "@/components/ui/GoogleMapEmbed";
import { getGoogleMapsEmbedUrl, getGoogleMapsRegionalEmbedUrl } from "@/lib/maps";
import { contactPage } from "@/lib/site-data";
import type { Office } from "@/lib/site-data";
import type { ContactRegionId } from "@/components/contact/ContactOfficeCards";

type OfficeLocatorProps = {
  selectedRegion: ContactRegionId;
  onSelectRegion: (region: ContactRegionId) => void;
  dubaiOffice: Office;
};

export function OfficeLocator({
  selectedRegion,
  onSelectRegion,
  dubaiOffice,
}: OfficeLocatorProps) {
  const { india, dubai } = contactPage.regions;
  const dubaiMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    dubai.mapsQuery,
  )}`;

  const mapSrc =
    selectedRegion === "india"
      ? getGoogleMapsRegionalEmbedUrl()
      : getGoogleMapsEmbedUrl(dubaiOffice);

  const mapTitle = selectedRegion === "india" ? "Map — India coverage" : `Map — ${dubai.label}`;
  const directionsUrl = selectedRegion === "india" ? india.mapsSearchUrl : dubaiMapsUrl;

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Select office region"
      >
        {(["india", "dubai"] as const).map((region) => (
          <button
            key={region}
            type="button"
            role="tab"
            aria-selected={selectedRegion === region}
            onClick={() => onSelectRegion(region)}
            className={`min-h-11 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-[border-color,background-color,color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none ${
              selectedRegion === region
                ? "border-[#1e7fd0] bg-[#1e7fd0] text-white"
                : "border-[#d7e6f0] bg-[#f8fbfd] text-[#364b5e] hover:border-[#1e7fd0]/50 hover:bg-[#f3f9fb]"
            }`}
          >
            {region === "india" ? india.label : dubai.label}
          </button>
        ))}
      </div>

      <div>
        <p className="text-sm font-semibold text-[#0e235e]">
          {selectedRegion === "india" ? india.label : dubai.label}
        </p>
        {selectedRegion === "india" ? (
          <p className="mt-1 text-sm leading-6 text-[#364b5e]">{india.coverageNote}</p>
        ) : (
          <address className="mt-1 not-italic text-sm leading-6 text-[#364b5e]">
            {dubai.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        )}
        <p className="mt-2 text-sm text-[#364b5e]">
          <a
            href={`tel:${(selectedRegion === "india" ? india.phone : dubai.phone).replace(/\s/g, "")}`}
            className="font-medium text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
          >
            {selectedRegion === "india" ? india.phone : dubai.phone}
          </a>
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#d7e6f0] bg-white transition-[border-color,background-color] duration-300 ease-out hover:border-[#c8d8e8] motion-reduce:transition-none">
        <div className="relative aspect-[21/9] min-h-[220px] w-full sm:min-h-[280px]">
          <GoogleMapEmbed
            src={mapSrc}
            title={mapTitle}
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-sm font-semibold text-[#1e7fd0] underline-offset-2 transition-colors duration-300 ease-out hover:text-pelagic-accent-hover hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
