"use client";

import { useState } from "react";
import { OfficeMap } from "@/components/ui/OfficeMap";
import type { Office } from "@/lib/site-data";

type OfficeMapPanelProps = {
  offices: Office[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
};

function officeTabLabel(label: string): string {
  const parts = label.split("—");
  return parts.length > 1 ? parts[1].trim() : label;
}

export function OfficeMapPanel({
  offices,
  activeIndex: controlledIndex,
  onActiveIndexChange,
}: OfficeMapPanelProps) {
  const [internalIndex, setInternalIndex] = useState(0);
  const activeIndex = controlledIndex ?? internalIndex;

  function setActiveIndex(index: number) {
    if (onActiveIndexChange) onActiveIndexChange(index);
    else setInternalIndex(index);
  }

  const activeOffice = offices[activeIndex];

  return (
    <div>
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Select office location"
      >
        {offices.map((office, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={office.label}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                isActive
                  ? "bg-pelagic-charcoal text-white shadow-md"
                  : "border border-pelagic-mist bg-white text-pelagic-steel hover:border-pelagic-gold hover:text-pelagic-charcoal"
              }`}
            >
              <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-pelagic-gold text-xs font-bold text-white">
                {index + 1}
              </span>
              {officeTabLabel(office.label)}
            </button>
          );
        })}
      </div>

      <OfficeMap
        key={activeOffice.label}
        office={activeOffice}
        tall
        className="mt-6"
      />
    </div>
  );
}
