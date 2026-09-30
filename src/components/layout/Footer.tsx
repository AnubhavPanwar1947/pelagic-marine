import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SocialBrandIcon } from "@/components/ui/SocialBrandIcon";
import { company, navLinks } from "@/lib/site-data";
import { socialLinks } from "@/lib/social-links";

type LegalFooterItem = {
  id: string;
  label: string;
  href?: string;
};

const legalLinks: LegalFooterItem[] = [
  { id: "privacy", label: "Privacy policy", href: "/privacy" },
  { id: "disclaimer", label: "Disclaimer", href: "/disclaimer" },
  { id: "cookies", label: "Cookies policy", href: "/cookies" },
  { id: "terms", label: "Terms & conditions", href: "/terms" },
  { id: "engagement", label: "Standard T&C of engagement", href: "/engagement" },
];

const legalLinkClassName = "min-w-0 break-words text-blue-100 hover:text-white";
const legalTextClassName = "min-w-0 break-words text-blue-100";

const footerLinkExclude = new Set(["Decarbonization", "Capabilities", "Contact"]);

const footerNavLinks = navLinks.filter((link) => !footerLinkExclude.has(link.label));

export function Footer() {
  return (
    <footer className="relative z-30 isolate overflow-x-clip bg-pelagic-navy text-blue-100">
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-14 pb-[max(3.5rem,env(safe-area-inset-bottom))] sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        <div className="site-footer-brand min-w-0 lg:col-span-4">
          <BrandLogo variant="footer" />
        </div>

        <div className="min-w-0 lg:col-span-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Links
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNavLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-blue-100 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-pelagic-light">
            Legal
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {legalLinks.map((item) => (
              <li key={item.id} className="min-w-0 break-words">
                {item.href ? (
                  <Link href={item.href} className={legalLinkClassName}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={legalTextClassName}>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 lg:col-span-3">
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
    </footer>
  );
}
