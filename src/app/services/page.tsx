import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { PracticeSection } from "@/components/services/PracticeSection";
import { serviceCategories } from "@/lib/site-data";
import "./services-theme.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Naval architecture and design, marine engineering, inspection/audits/surveying, mooring analysis and loadicator tools from Pelagic Marine.",
};

export default function ServicesPage() {
  return (
    <div className="services-page">
      <PageHero
        eyebrow="Services"
        title="Practices built for the full vessel lifecycle"
        description="Concept design, structural analysis, surveys, audits, mooring studies and loading tools — the same engineering rigour, whichever practice you need."
      />

      <div className="services-practice-stack">
        {serviceCategories.map((service) => (
          <PracticeSection key={service.slug} service={service} />
        ))}
      </div>
    </div>
  );
}
