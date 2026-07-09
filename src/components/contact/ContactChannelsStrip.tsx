import { ContactSocialLinks } from "@/components/contact/ContactSocialLinks";

/** No Reveal here — bottom section must stay visible above footer. */
export function ContactChannelsStrip() {
  return (
    <section className="border-t border-pelagic-sand py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="contact-card-gradient-shell contact-card-gradient-shell--dark rounded-3xl p-[3px] shadow-xl">
          <div className="rounded-[21px] bg-pelagic-charcoal/92 px-6 py-12 text-white backdrop-blur-sm sm:px-10 lg:px-12 lg:py-14">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-xl flex-1">
                <p className="text-base font-bold uppercase tracking-[0.22em] text-amber-200 sm:text-lg">
                  Direct channels
                </p>
                <h2 className="font-display mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl">
                  Reach us your way
                </h2>
                <p className="mt-5 text-base leading-relaxed text-teal-50 sm:text-lg">
                  Prefer email or messaging? We respond on all channels — use the form above for full
                  scope, or reach out directly for urgent attendance.
                </p>
              </div>
              <div className="shrink-0 rounded-3xl border border-white/25 bg-white/15 p-6 shadow-xl backdrop-blur-md">
                <ContactSocialLinks variant="strip" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
