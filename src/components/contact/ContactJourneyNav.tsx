"use client";

import { useEffect, useState } from "react";

export const contactJourneySteps = [
  { id: "contact-hero", label: "Enquire" },
  { id: "contact-trust", label: "Our reach" },
  { id: "contact-offices", label: "Offices" },
  { id: "locations-map", label: "Map" },
  { id: "contact-why", label: "Why us" },
  { id: "contact-next-steps", label: "Next steps" },
] as const;

export function ContactJourneyNav() {
  const [activeId, setActiveId] = useState<string>(contactJourneySteps[0].id);

  useEffect(() => {
    const sections = contactJourneySteps
      .map((step) => document.getElementById(step.id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Contact page journey"
      className="sticky top-0 z-40 border-b border-white/40 bg-white/85 shadow-sm backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-pelagic-accent sm:text-left">
          Your journey on this page
        </p>
        <ol className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {contactJourneySteps.map((step, index) => {
            const isActive = activeId === step.id;
            return (
              <li key={step.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => scrollTo(step.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    isActive
                      ? "border-pelagic-gold bg-pelagic-gold text-white shadow-md"
                      : "border-pelagic-mist bg-white text-pelagic-charcoal hover:border-pelagic-gold/50 hover:bg-pelagic-sand"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                      isActive ? "bg-white/25 text-white" : "bg-pelagic-accent/10 text-pelagic-accent"
                    }`}
                  >
                    {index + 1}
                  </span>
                  {step.label}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
