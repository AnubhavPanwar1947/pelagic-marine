import { contactPage } from "@/lib/site-data";

export function ContactSlaStrip() {
  return (
    <section className="border-b border-pelagic-sand bg-pelagic-cream/80 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-pelagic-steel">
            <span className="inline-flex items-center gap-2 font-semibold text-pelagic-charcoal">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {contactPage.sla.avgLabel}: {contactPage.sla.avgValue}
            </span>
            <span>{contactPage.sla.standard}</span>
            <span className="hidden sm:inline">{contactPage.sla.urgent}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {contactPage.accreditations.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-pelagic-sand bg-white px-3 py-2.5 text-center shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[11px] text-pelagic-steel">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
