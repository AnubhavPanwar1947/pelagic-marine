import { SocialBrandIcon } from "@/components/ui/SocialBrandIcon";
import { socialLinks } from "@/lib/social-links";

type ContactSocialLinksProps = {
  variant?: "hero" | "strip";
};

export function ContactSocialLinks({ variant = "hero" }: ContactSocialLinksProps) {
  if (variant === "strip") {
    return (
      <div className="flex flex-wrap gap-3">
        {socialLinks.map((link) => (
          <a
            key={link.brand}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-2.5 rounded-lg border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/25"
          >
            <SocialBrandIcon brand={link.brand} size={18} />
            {link.label}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-pelagic-steel">
        Connect
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {socialLinks.map((link) => (
          <a
            key={link.brand}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            title={link.label}
            className="group inline-flex items-center gap-2 rounded-full border border-pelagic-mist bg-white px-3 py-1.5 text-xs font-semibold text-pelagic-charcoal shadow-sm transition hover:border-pelagic-accent/40 hover:shadow-md"
          >
            <SocialBrandIcon brand={link.brand} size={16} />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
