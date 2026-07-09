"use client";

import { ContactFaqSection } from "@/components/contact/ContactFaqSection";
import { ContactHeroSection } from "@/components/contact/ContactHeroSection";
import { ContactMobileBar } from "@/components/contact/ContactMobileBar";
import { ContactOfficesSection } from "@/components/contact/ContactOfficesSection";
import { ContactPageTheme } from "@/components/contact/ContactPageTheme";
import { company, trustBadges } from "@/lib/site-data";
import { useState } from "react";

export default function ContactPage() {
  const [selectedOffice, setSelectedOffice] = useState(0);

  return (
    <ContactPageTheme>
      <ContactHeroSection />

      <section className="border-y border-pelagic-sand bg-white py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-4 text-sm text-pelagic-steel sm:px-6 lg:px-8">
          {trustBadges.map((badge) => (
            <span key={badge} className="flex items-center gap-2">
              <span className="text-pelagic-gold">✓</span>
              {badge}
            </span>
          ))}
        </div>
      </section>

      <ContactOfficesSection
        offices={company.offices}
        selectedIndex={selectedOffice}
        onSelectOffice={setSelectedOffice}
      />

      <ContactFaqSection />

      <ContactMobileBar />

      <div className="h-16 lg:hidden" aria-hidden />
    </ContactPageTheme>
  );
}
