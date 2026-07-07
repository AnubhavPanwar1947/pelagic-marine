import Link from "next/link";
import { company, navLinks } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="border-t border-pelagic-sand bg-pelagic-charcoal text-stone-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="font-display text-lg font-semibold text-white">
            {company.name}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-stone-400">
            Marine surveying, naval architecture, engineering, and maritime legal
            consultancy — serving clients worldwide since {company.founded}.
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold-light">
            Links
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="text-xs font-bold uppercase tracking-wider text-pelagic-gold-light">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${company.emails.info}`} className="hover:text-white">
                {company.emails.info}
              </a>
            </li>
            <li>{company.phones.india}</li>
            <li>{company.phones.uae}</li>
            <li>
              <a
                href={company.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-700 px-4 py-5 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} {company.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
