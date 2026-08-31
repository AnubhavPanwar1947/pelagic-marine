"use client";

import { contactPage } from "@/lib/site-data";
import type { Office } from "@/lib/site-data";

export type ContactRegionId = "india" | "dubai";

type ContactRegionalCardsProps = {
  selectedRegion: ContactRegionId;
  onSelectRegion: (region: ContactRegionId) => void;
  dubaiOffice: Office;
};

export function ContactOfficeCards({
  selectedRegion,
  onSelectRegion,
  dubaiOffice,
}: ContactRegionalCardsProps) {
  const { india, dubai } = contactPage.regions;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onSelectRegion("india")}
        aria-pressed={selectedRegion === "india"}
        className={`rounded-xl border p-5 text-left transition-[border-color,background-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none ${
          selectedRegion === "india"
            ? "border-[#1e7fd0] bg-white ring-1 ring-[#1e7fd0]/25"
            : "border-[#d7e6f0] bg-white hover:border-[#1e7fd0]/40 hover:bg-[#f3f9fb]"
        }`}
      >
        <p className="text-sm font-semibold text-[#0e235e]">{india.label}</p>
        <p className="mt-2 text-sm leading-6 text-[#364b5e]">{india.description}</p>
        <p className="mt-3 text-sm font-medium text-[#1e7fd0]">{india.phone}</p>
      </button>

      <button
        type="button"
        onClick={() => onSelectRegion("dubai")}
        aria-pressed={selectedRegion === "dubai"}
        className={`rounded-xl border p-5 text-left transition-[border-color,background-color] duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e7fd0] motion-reduce:transition-none ${
          selectedRegion === "dubai"
            ? "border-[#1e7fd0] bg-white ring-1 ring-[#1e7fd0]/25"
            : "border-[#d7e6f0] bg-white hover:border-[#1e7fd0]/40 hover:bg-[#f3f9fb]"
        }`}
      >
        <p className="text-sm font-semibold text-[#0e235e]">{dubai.label}</p>
        <p className="mt-2 text-sm leading-6 text-[#364b5e]">
          {dubaiOffice.tagline ?? "Middle East shipping and offshore advisory"}
        </p>
        <address className="mt-3 not-italic text-sm leading-6 text-[#364b5e]">
          {dubai.addressLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <p className="mt-2 text-sm font-medium text-[#1e7fd0]">{dubai.phone}</p>
      </button>
    </div>
  );
}
