import Link from "next/link";
import { company } from "@/lib/site-data";

export function ContactCTABand() {
  return (
    <section className="relative overflow-hidden border-t border-teal-900/30 py-14 text-white">
      <div
        className="absolute inset-0 bg-gradient-to-br from-teal-800 via-slate-900 to-pelagic-ink"
        aria-hidden
      />
      <div className="cta-band-shimmer pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">
            Ready to mobilise
          </p>
          <h2 className="font-display mt-2 text-2xl font-semibold sm:text-3xl">
            Vessel alongside? Survey this week? We can help.
          </h2>
          <p className="mt-3 text-sm leading-7 text-white/80">
            Master mariners and engineers across Mumbai, Dehradun, and Dubai — typical
            response within one business day.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
          <Link
            href="#enquiry-form"
            className="rounded-lg bg-pelagic-gold px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-pelagic-gold-light"
          >
            Submit enquiry
          </Link>
          <a
            href={`tel:${company.phones.india.replace(/\s/g, "")}`}
            className="rounded-lg border border-white/30 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
          >
            Call 24/7 line
          </a>
        </div>
      </div>
    </section>
  );
}
