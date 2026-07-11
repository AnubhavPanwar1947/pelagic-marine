"use client";

import { company } from "@/lib/site-data";

export function ContactMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pelagic-accent/30 bg-pelagic-navy px-4 py-3 shadow-[0_-8px_30px_rgba(20,48,110,0.25)] lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-pelagic-light">24/7 line</p>
          <p className="truncate text-xs text-white/80">Casualty & urgent survey</p>
        </div>
        <a
          href={`tel:${company.phones.india.replace(/\s/g, "")}`}
          className="shrink-0 rounded-full bg-pelagic-accent px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-pelagic-light"
        >
          Call now
        </a>
      </div>
    </div>
  );
}
