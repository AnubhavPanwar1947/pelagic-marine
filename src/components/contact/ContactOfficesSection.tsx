"use client";

import { ContactOfficeCards } from "@/components/contact/ContactOfficeCards";
import { OfficeLocator } from "@/components/contact/OfficeLocator";
import type { ContactRegionId } from "@/components/contact/ContactOfficeCards";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactPage } from "@/lib/site-data";
import type { Office } from "@/lib/site-data";

type ContactOfficesSectionProps = {
  dubaiOffice: Office;
  selectedRegion: ContactRegionId;
  onSelectRegion: (region: ContactRegionId) => void;
};

export function ContactOfficesSection({
  dubaiOffice,
  selectedRegion,
  onSelectRegion,
}: ContactOfficesSectionProps) {
  return (
    <section className="border-y border-[#d7e6f0] bg-[#eef8fd] section-py-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={contactPage.officesSection.eyebrow}
            title={contactPage.officesSection.title}
            description={contactPage.officesSection.description}
          />
        </Reveal>

        <Reveal delay={80} className="mt-10">
          <ContactOfficeCards
            selectedRegion={selectedRegion}
            onSelectRegion={onSelectRegion}
            dubaiOffice={dubaiOffice}
          />
        </Reveal>

        <div id="offices-map" className="mt-12 scroll-mt-28">
          <Reveal delay={120}>
            <div className="rounded-xl border border-[#d7e6f0] bg-white p-5 transition-[border-color,background-color] duration-300 ease-out motion-reduce:transition-none sm:p-6">
              <h3 className="font-display type-subsection-title font-semibold text-[#0e235e]">
                {contactPage.networkHub.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#364b5e] sm:text-base">
                {contactPage.networkHub.description}
              </p>
              <div className="mt-6">
                <OfficeLocator
                  selectedRegion={selectedRegion}
                  onSelectRegion={onSelectRegion}
                  dubaiOffice={dubaiOffice}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
