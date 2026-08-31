"use client";

import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { ContactOfficesSection } from "@/components/contact/ContactOfficesSection";
import type { ContactRegionId } from "@/components/contact/ContactOfficeCards";
import { ContactPageTheme } from "@/components/contact/ContactPageTheme";
import { company, trustBadges } from "@/lib/site-data";
import { useMemo, useState } from "react";

export default function ContactPage() {
  const [selectedRegion, setSelectedRegion] = useState<ContactRegionId>("dubai");

  const dubaiOffice = useMemo(
    () => company.offices.find((office) => office.id === "dubai")!,
    [],
  );

  return (
    <ContactPageTheme>
      <ContactHeroSection />

      <section className="border-y border-[#d7e6f0] bg-[#e8f4fb] py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-[#364b5e] sm:px-6 lg:px-8">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="text-[#1e7fd0]">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </section>

      <ContactOfficesSection
        dubaiOffice={dubaiOffice}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      <ContactFaqSection />
    </ContactPageTheme>
  );
}
