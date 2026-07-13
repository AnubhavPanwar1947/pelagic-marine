import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageShellProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPageShell({ eyebrow, title, updated, children }: LegalPageShellProps) {
  return (
    <div className="bg-pelagic-cream">
      <section className="border-b border-pelagic-sand bg-gradient-to-br from-pelagic-sky/80 via-white to-pelagic-mist/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="type-eyebrow">{eyebrow}</p>
          <h1 className="type-display mt-4 text-3xl text-pelagic-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-pelagic-steel">Last updated: {updated}</p>
        </div>
      </section>

      <article className="legal-prose mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">{children}</article>

      <div className="border-t border-pelagic-sand bg-white py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-4 text-sm font-semibold text-pelagic-accent sm:px-6 lg:px-8">
          <Link href="/privacy" className="hover:underline">
            Privacy policy
          </Link>
          <Link href="/cookies" className="hover:underline">
            Cookie policy
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms of use
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
