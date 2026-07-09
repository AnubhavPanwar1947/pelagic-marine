import { company } from "@/lib/site-data";

export function ContactWelcomeBanner() {
  return (
    <div className="border-b border-teal-300/60 bg-gradient-to-r from-teal-100 via-sky-200 to-amber-100">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm leading-relaxed text-pelagic-steel sm:text-base">
          <span className="font-display font-semibold text-pelagic-ink">
            You are not sending a ticket into the void.
          </span>{" "}
          A real consultant at {company.name} will read your message and respond with care —
          whether your project is urgent at sea or planned ashore.
        </p>
      </div>
    </div>
  );
}
