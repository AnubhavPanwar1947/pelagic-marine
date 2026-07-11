import Link from "next/link";
import { SocialBrandIcon } from "@/components/ui/SocialBrandIcon";
import { company, navLinks } from "@/lib/site-data";
import { socialLinks } from "@/lib/social-links";

export function Footer() {
  return (
    <footer className="relative z-30 isolate border-t border-pelagic-blue/40 bg-pelagic-navy text-blue-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <p className="type-display text-lg text-white">
            {company.name}
          </p>
          <p className="type-caption mt-3 max-w-sm text-blue-100/85">
            Naval architecture and marine engineering consultancy — stability, structures,
            hydrodynamics and clean-fuel advisory, from Dubai to fleets worldwide.
          </p>
        </div>

        <div className="lg:col-span-3">
          <p className="type-eyebrow text-pelagic-light">Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-blue-100/90 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <p className="type-eyebrow text-pelagic-light">Contact</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${company.emails.info}`} className="text-blue-100/90 hover:text-white">
                {company.emails.info}
              </a>
            </li>
            <li>{company.phones.india}</li>
            <li>{company.phones.uae}</li>
            <li className="pt-2">
              <div className="flex flex-wrap gap-3">
                {socialLinks
                  .filter((link) => link.brand !== "email")
                  .map((link) => (
                    <a
                      key={link.brand}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-1.5 text-blue-100/90 hover:text-white"
                    >
                      <SocialBrandIcon brand={link.brand} size={16} />
                      {link.label}
                    </a>
                  ))}
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-pelagic-blue/30 px-4 py-5 text-center text-xs text-blue-200/60">
        © {new Date().getFullYear()} {company.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
