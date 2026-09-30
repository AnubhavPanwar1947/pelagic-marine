import type { ReactNode } from "react";

type LegalPageShellProps = {
  title: string;
  children: ReactNode;
};

export function LegalPageShell({ title, children }: LegalPageShellProps) {
  return (
    <div className="bg-pelagic-cream">
      <section className="border-b border-pelagic-sand bg-gradient-to-br from-pelagic-sky/80 via-white to-pelagic-mist/40">
        <div className="mx-auto max-w-3xl min-w-0 px-1.5 pt-[clamp(4rem,2.5rem+4vw,5rem)] pb-6 sm:px-6 lg:px-8">
          <h1 className="type-display type-page-title min-w-0 break-words text-pelagic-ink">
            {title}
          </h1>
        </div>
      </section>

      <article className="legal-prose mx-auto max-w-3xl min-w-0 px-1.5 pt-8 pb-12 sm:px-6 lg:px-8">{children}</article>
    </div>
  );
}
