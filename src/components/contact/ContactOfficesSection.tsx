"use client";

import { ContactOfficeCards } from "@/components/contact/ContactOfficeCards";
import { OfficeLocator } from "@/components/contact/OfficeLocator";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { contactPage } from "@/lib/site-data";
import type { Office } from "@/lib/site-data";

type ContactOfficesSectionProps = {
  offices: Office[];
  selectedIndex: number;
  onSelectOffice: (index: number) => void;
};

export function ContactOfficesSection({
  offices,
  selectedIndex,
  onSelectOffice,
}: ContactOfficesSectionProps) {
  function scrollToMap() {
    document.getElementById("offices-map")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="bg-maritime-grid py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Global footprint"
            title="Our offices"
            description="Mumbai · Dehradun · Dubai — direct lines, regional surveyors, and yard attendance."
          />
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <ContactOfficeCards
            offices={offices}
            selectedIndex={selectedIndex}
            onSelectOffice={onSelectOffice}
            onViewMap={scrollToMap}
          />
        </Reveal>

        <div id="offices-map" className="scroll-mt-28 mt-16">
          <Reveal delay={120}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-display text-2xl font-semibold text-pelagic-ink sm:text-3xl">
                  {contactPage.networkHub.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-pelagic-steel sm:text-base">
                  {contactPage.networkHub.description}
                </p>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold">
                Select a card to focus the map
              </p>
            </div>
            <div className="card-premium contact-map-panel mt-6 overflow-hidden rounded-3xl border border-pelagic-sand/80 p-4 shadow-lg sm:p-6">
              <OfficeLocator
                offices={offices}
                selectedIndex={selectedIndex}
                onSelectOffice={onSelectOffice}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
