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
    <div className="flex items-center gap-2.5" aria-label="Social links">
      {socialLinks.map((link) => (
        <a
          key={link.brand}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          title={link.label}
          aria-label={link.label}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-pelagic-accent/30 bg-white/90 text-pelagic-charcoal shadow-sm transition hover:border-pelagic-accent/55 hover:bg-white hover:text-pelagic-ink"
        >
          <SocialBrandIcon brand={link.brand} size={18} />
        </a>
      ))}
    </div>
  );
}
