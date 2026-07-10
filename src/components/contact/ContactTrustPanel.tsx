"use client";

import { ContactAlternateChannels } from "@/components/contact/ContactAlternateChannels";
import { useContactEnquiry } from "@/components/contact/ContactEnquiryContext";
import { ContactPanelShell } from "@/components/contact/ContactPanelShell";
import {
  ContactFormIntro,
  ContactFormQuickIntake,
  ContactResponseSteps,
} from "@/components/contact/ContactFormSidebar";
import { ContactFormTrustBar } from "@/components/contact/ContactFormTrustBar";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { contactPage } from "@/lib/site-data";

export function ContactTrustPanel() {
  const { activeIntake, applyQuickIntake } = useContactEnquiry();

  return (
    <ContactPanelShell innerClassName="bg-white/95">
      <div className="flex h-full flex-col p-5 sm:p-6">
        <div className="border-b border-pelagic-gold/20 pb-3">
          <BrandLogo variant="header" linked={false} compact />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <ContactFormTrustBar compact />
          <ContactFormIntro />

          <ContactFormQuickIntake
            fill
            activeIntake={activeIntake}
            onSelect={applyQuickIntake}
          />

          <div className="mt-auto flex flex-col justify-end gap-3 pt-4">
            <ContactAlternateChannels variant="promo" />
            <ContactResponseSteps compact />
            <p className="text-xs leading-5 text-pelagic-steel">
              <span className="font-semibold text-pelagic-charcoal">{contactPage.sla.standard}.</span>{" "}
              {contactPage.sla.urgent}
            </p>
          </div>
        </div>
      </div>
    </ContactPanelShell>
  );
}
