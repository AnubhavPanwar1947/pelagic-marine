import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { FooterCookieLink } from "@/components/layout/FooterCookieLink";
import { FooterWave } from "@/components/layout/FooterWave";
import { SocialBrandIcon } from "@/components/ui/SocialBrandIcon";
import { company, navLinks } from "@/lib/site-data";
import { socialLinks } from "@/lib/social-links";

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/cookies", label: "Cookie policy" },
  { href: "/terms", label: "Terms of use" },
];

const officeLocations = ["Singapore", "India", "Dubai"];

export function Footer() {
  return (
    <footer className="relative z-30 isolate overflow-x-clip border-t border-pelagic-blue/40 bg-pelagic-navy text-blue-100">
      {/* Full-bleed wavy top edge (white → navy) */}
      <div className="footer-wave-edge" aria-hidden>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffff"
            d="M0,40 C240,80 480,0 720,32 C960,64 1200,8 1440,40 L1440,72 L0,72 Z"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <BrandLogo variant="footer" />
          <p className="mt-4 max-w-sm pl-[var(--logo-lockup-anchor-x)] text-sm leading-7 text-blue-50">
            Naval architecture and marine engineering consultancy — stability, structures,
            hydrodynamics and clean-fuel advisory, from Dubai to fleets worldwide.
          </p>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Links
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-blue-100 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-blue-100 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <FooterCookieLink />
            </li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Our offices
          </p>
          <ul className="mt-4 space-y-2 text-sm text-blue-100">
            {officeLocations.map((location) => (
              <li key={location}>{location}</li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={`mailto:${company.emails.info}`} className="text-blue-100 hover:text-white">
                {company.emails.info}
              </a>
            </li>
            <li className="text-blue-100">{company.phones.india}</li>
            <li className="text-blue-100">{company.phones.uae}</li>
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
                      className="inline-flex items-center gap-1.5 text-blue-100 hover:text-white"
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

      <div className="relative z-10 border-t border-pelagic-blue/30 px-4 pb-24 pt-5 text-center text-xs text-blue-200/70 sm:pb-28">
        <p>
          © {new Date().getFullYear()} {company.legalName}. All rights reserved.
        </p>
      </div>

      {/* Animated wave layers — full left → right */}
      <FooterWave />
    </footer>
  );
}
