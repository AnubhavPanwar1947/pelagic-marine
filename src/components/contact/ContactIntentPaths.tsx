import { contactPage } from "@/lib/site-data";

type ContactIntentPathsProps = {
  onScrollToForm: () => void;
};

export function ContactIntentPaths({ onScrollToForm }: ContactIntentPathsProps) {
  return (
    <section className="border-b border-pelagic-mist bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pelagic-accent">
            How can we help?
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold text-pelagic-ink">
            Contact the right team
          </h2>
          <p className="mt-3 text-sm leading-7 text-pelagic-steel">
            Choose the path that matches your request — the same structure used by
            Lloyd&apos;s Register, ABL, and leading marine survey firms.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {contactPage.intentPaths.map((path) => {
            const isForm = "target" in path && path.target === "enquiry-form";

            const content = (
              <>
                <div className="bg-slate-800 px-5 py-3">
                  <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                    {path.title}
                  </h3>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex-1 text-sm leading-6 text-pelagic-steel">{path.description}</p>
                  <span className="mt-5 inline-flex text-sm font-bold uppercase tracking-wider text-pelagic-accent group-hover:text-pelagic-gold">
                    {path.cta} →
                  </span>
                </div>
              </>
            );

            const cardClass =
              "seadelta-card group flex h-full flex-col overflow-hidden rounded-xl border border-pelagic-mist bg-white text-left shadow-md transition hover:-translate-y-1 hover:border-pelagic-accent/40 hover:shadow-lg";

            if (isForm) {
              return (
                <button key={path.id} type="button" onClick={onScrollToForm} className={cardClass}>
                  {content}
                </button>
              );
            }

            return (
              <a
                key={path.id}
                href={"href" in path ? path.href : "#"}
                className={cardClass}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
