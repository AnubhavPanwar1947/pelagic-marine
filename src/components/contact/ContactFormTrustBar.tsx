import { contactPage } from "@/lib/site-data";

type ContactFormTrustBarProps = {
  compact?: boolean;
};

export function ContactFormTrustBar({ compact = false }: ContactFormTrustBarProps) {
  if (compact) {
    return (
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {contactPage.hero.stats.map((stat) => (
          <div
            key={`${stat.label}-${stat.value}`}
            className="rounded-lg border border-pelagic-sand/80 bg-pelagic-cream/50 px-2 py-2 text-center"
          >
            <p className="font-display text-base font-bold text-pelagic-ink">{stat.value}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-pelagic-steel">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {contactPage.hero.stats.map((stat) => (
          <div
            key={`${stat.label}-${stat.value}`}
            className="rounded-xl border border-pelagic-sand/80 bg-pelagic-cream/50 px-3 py-2.5 text-center"
          >
            <p className="font-display text-lg font-bold text-pelagic-ink">{stat.value}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-pelagic-steel">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {contactPage.accreditations.map((item) => (
          <span
            key={item.label}
            title={item.detail}
            className="inline-flex items-center gap-1.5 rounded-full border border-pelagic-gold/25 bg-white px-3 py-1 text-[11px] font-semibold text-pelagic-charcoal"
          >
            <span className="text-pelagic-gold">✓</span>
            {item.label}
          </span>
        ))}
      </div>

      <div className="rounded-xl border border-pelagic-accent/15 bg-pelagic-sky/30 px-4 py-3 text-sm text-pelagic-charcoal">
        <span className="font-semibold text-pelagic-accent">{contactPage.sla.avgLabel}:</span>{" "}
        {contactPage.sla.avgValue} · {contactPage.sla.standard}
      </div>
    </div>
  );
}
