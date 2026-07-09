import { company } from "@/lib/site-data";

export function ContactQuickBar() {
  return (
    <div className="border-b border-pelagic-water/40 bg-gradient-to-r from-pelagic-sky/80 via-pelagic-cream to-pelagic-sunset/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-3.5 text-sm sm:gap-x-8 sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-pelagic-gold">
          <span className="h-2 w-2 rounded-full bg-pelagic-gold" />
          24/7 support
        </span>
        <a
          href={`tel:${company.phones.india.replace(/\s/g, "")}`}
          className="font-medium text-pelagic-charcoal transition hover:text-pelagic-gold"
        >
          India · {company.phones.india}
        </a>
        <a
          href={`tel:${company.phones.uae.replace(/\s/g, "")}`}
          className="font-medium text-pelagic-charcoal transition hover:text-pelagic-gold"
        >
          UAE · {company.phones.uae}
        </a>
        <a
          href={`mailto:${company.emails.info}`}
          className="font-medium text-pelagic-charcoal transition hover:text-pelagic-gold"
        >
          {company.emails.info}
        </a>
      </div>
    </div>
  );
}
