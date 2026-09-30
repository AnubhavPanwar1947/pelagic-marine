import Link from "next/link";
import type { ReactNode } from "react";
import { legalCrossLinks } from "@/lib/legal-links";

type LegalPageShellProps = {
  title: string;
  updated: string;
  children: ReactNode;
};

export function LegalPageShell({ title, updated, children }: LegalPageShellProps) {
  return (
    <div className="bg-pelagic-cream">
      <section className="border-b border-pelagic-sand bg-gradient-to-br from-pelagic-sky/80 via-white to-pelagic-mist/40">
        <div className="mx-auto max-w-3xl min-w-0 px-4 page-hero-py sm:px-6 lg:px-8">
          <h1 className="type-display type-page-title min-w-0 break-words text-pelagic-ink">
            {title}
          </h1>
          <p className="type-copy-muted mt-3">Last updated: {updated}</p>
        </div>
      </section>

      <article className="legal-prose mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">{children}</article>

      <div className="border-t border-pelagic-sand bg-white py-8">
        <div className="mx-auto flex max-w-3xl min-w-0 flex-wrap gap-x-6 gap-y-2 px-4 text-sm font-semibold text-pelagic-accent sm:px-6 lg:px-8">
          {legalCrossLinks.map((link) => (
            <Link key={link.href} href={link.href} className="min-w-0 break-words hover:underline">
              {link.label}
            </Link>
          ))}
          <Link href="/contact" className="min-w-0 break-words hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
