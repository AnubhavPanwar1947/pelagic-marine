"use client";

import { ContactChannelsStrip } from "@/components/contact/ContactChannelsStrip";
import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { ContactMobileBar } from "@/components/contact/ContactMobileBar";
import { ContactOfficesSection } from "@/components/contact/ContactOfficesSection";
import { ContactPageTheme } from "@/components/contact/ContactPageTheme";
import { ContactRoadmapSection } from "@/components/contact/ContactRoadmapSection";
import { ContactSlaStrip } from "@/components/contact/ContactSlaStrip";
import { company, trustBadges } from "@/lib/site-data";
import { useState } from "react";

export default function ContactPage() {
  const [selectedOffice, setSelectedOffice] = useState(0);

  return (
    <ContactPageTheme>
      <ContactHeroSection />

      <section className="border-y border-pelagic-sand bg-white py-5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-pelagic-steel sm:px-6 lg:px-8">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="text-pelagic-gold">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </section>

      <ContactSlaStrip />

      <ContactOfficesSection
        offices={company.offices}
        selectedIndex={selectedOffice}
        onSelectOffice={setSelectedOffice}
      />

      <ContactRoadmapSection compact showQuote />

      <ContactFaqSection />

      <ContactChannelsStrip />

      <ContactMobileBar />

      <div className="h-16 lg:hidden" aria-hidden />
    </ContactPageTheme>
  );
}
