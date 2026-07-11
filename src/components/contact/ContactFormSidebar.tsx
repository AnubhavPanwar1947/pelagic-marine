import { contactPage } from "@/lib/site-data";

const intakeHints: Record<string, string> = {
  lng: "Compatibility & bunkering supervision",
  casualty: "Damage survey — vessel alongside",
  compass: "Fleet compass adjustment",
  warranty: "Load-out & marine warranty",
};

export function ContactFormIntro() {
  return (
    <div className="mt-4 border-t border-pelagic-accent/15 pt-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-pelagic-accent">
        Project enquiry
      </p>
      <h2 className="font-display mt-1 text-lg font-semibold text-pelagic-ink">
        Request expert attendance
      </h2>
      <p className="mt-1.5 text-sm leading-relaxed text-pelagic-body">
        Vessel, port &amp; urgency first — routed to India or UAE.
      </p>
    </div>
  );
}

export function ContactFormQuickIntake({
  activeIntake,
  onSelect,
  fill = false,
}: {
  activeIntake: string | null;
  onSelect: (id: string) => void;
  fill?: boolean;
}) {
  return (
    <div className={`mt-3 flex flex-col ${fill ? "min-h-0 flex-1" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-wider text-pelagic-slate">Quick intake</p>
      <div
        className={`mt-2 grid grid-cols-2 gap-2 ${fill ? "min-h-0 flex-1 auto-rows-fr" : ""}`}
      >
        {contactPage.quickIntake.map((item) => {
          const isActive = activeIntake === item.id;
          const hint = intakeHints[item.id] ?? item.messageHint.split("—")[0];

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`group flex h-full flex-col justify-between rounded-xl border text-left transition ${
                fill ? "p-3 sm:p-3.5" : "p-2.5"
              } ${
                isActive
                  ? "border-pelagic-accent bg-pelagic-accent/10 shadow-sm ring-1 ring-pelagic-accent/30"
                  : "card-maritime border-pelagic-mist hover:border-pelagic-accent/50 hover:shadow-sm"
              }`}
            >
              <span
                className={`font-display font-semibold leading-snug text-pelagic-ink ${
                  fill ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                }`}
              >
                {item.label}
              </span>
              {fill && (
                <span className="mt-2 line-clamp-2 text-sm leading-snug text-pelagic-body">
                  {hint}
                </span>
              )}
              <span
                className={`mt-auto inline-flex pt-2 text-xs font-bold uppercase tracking-wide text-pelagic-accent ${
                  fill ? "" : "pt-1"
                }`}
              >
                {isActive ? "Selected" : "Pre-fill form"} →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ContactResponseSteps({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {contactPage.responseSteps.map((step) => (
          <div
            key={step.step}
            className="card-maritime rounded-lg border px-2.5 py-2"
          >
            <p className="text-xs font-bold text-pelagic-accent">{step.step}</p>
            <p className="mt-0.5 text-xs font-semibold leading-snug text-pelagic-ink">{step.title}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-2">
      {contactPage.responseSteps.map((step) => (
        <div
          key={step.step}
          className="card-maritime rounded-xl border p-3.5 sm:p-4"
        >
          <p className="text-xs font-bold text-pelagic-accent">{step.step}</p>
          <p className="mt-1 text-sm font-semibold text-pelagic-ink">{step.title}</p>
          <p className="mt-1 text-xs leading-5 text-pelagic-steel">{step.text}</p>
        </div>
      ))}
    </div>
  );
}
