import { company, contactPage } from "@/lib/site-data";

export function ContactEmergencyBar() {
  return (
    <div className="border-b border-red-900/30 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" aria-hidden />
            Casualty response
          </span>
          <p className="text-sm text-slate-300">{contactPage.emergency.detail}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            href={`tel:${company.phones.india.replace(/\s/g, "")}`}
            className="font-semibold text-white hover:text-pelagic-gold-light"
          >
            India {company.phones.india}
          </a>
          <span className="hidden text-white/30 sm:inline" aria-hidden>
            |
          </span>
          <a
            href={`tel:${company.phones.uae.replace(/\s/g, "")}`}
            className="font-semibold text-white hover:text-pelagic-gold-light"
          >
            UAE {company.phones.uae}
          </a>
        </div>
      </div>
    </div>
  );
}
