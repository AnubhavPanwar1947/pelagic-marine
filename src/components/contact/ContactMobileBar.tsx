"use client";

import { company } from "@/lib/site-data";

export function ContactMobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-pelagic-gold/30 bg-pelagic-charcoal/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.2)] backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">24/7 line</p>
          <p className="truncate text-xs text-white/80">Casualty & urgent survey</p>
        </div>
        <a
          href={`tel:${company.phones.india.replace(/\s/g, "")}`}
          className="shrink-0 rounded-full bg-pelagic-gold px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-pelagic-gold-light"
        >
          Call now
        </a>
      </div>
    </div>
  );
}
