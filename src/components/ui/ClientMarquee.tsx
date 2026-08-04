import { clientCompanies } from "@/lib/site-data";

export function ClientMarquee() {
  const row = [...clientCompanies, ...clientCompanies];

  return (
    <div className="client-marquee relative overflow-hidden py-3" aria-label="Client companies">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white via-white/90 to-transparent sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white via-white/90 to-transparent sm:w-28" />

      <div className="client-marquee-track flex w-max gap-4 py-2 sm:gap-5">
        {row.map((name, index) => (
          <span
            key={`${name}-${index}`}
            className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-pelagic-sand/80 bg-gradient-to-br from-white to-pelagic-sky/40 px-5 py-3.5 text-sm font-semibold tracking-wide text-pelagic-ink shadow-[0_10px_28px_rgba(20,48,110,0.05)] sm:text-[15px]"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full bg-pelagic-accent/12 text-[10px] font-bold uppercase tracking-wider text-pelagic-accent"
              aria-hidden
            >
              {name
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </span>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
