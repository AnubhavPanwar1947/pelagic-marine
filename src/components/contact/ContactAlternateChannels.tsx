import { SocialBrandIcon } from "@/components/ui/SocialBrandIcon";
import { socialLinks } from "@/lib/social-links";

type ContactAlternateChannelsProps = {
  variant?: "compact" | "promo" | "fit";
};

export function ContactAlternateChannels({ variant = "compact" }: ContactAlternateChannelsProps) {
  const isFit = variant === "fit";
  const isPromo = variant === "promo" || isFit;

  return (
    <div
      className={`rounded-xl border border-pelagic-gold/25 bg-gradient-to-br from-white to-pelagic-cream/60 ${
        isFit ? "p-3.5" : isPromo ? "p-5 sm:p-6" : "p-3"
      }`}
    >
      <p
        className={`font-bold uppercase tracking-[0.14em] text-pelagic-gold ${
          isFit ? "text-xs" : isPromo ? "text-sm sm:text-base" : "text-[10px] sm:text-xs"
        }`}
      >
        Prefer another channel?
      </p>
      <div className={`flex flex-wrap ${isFit ? "mt-2 gap-2" : isPromo ? "mt-4 gap-3" : "mt-2 gap-1.5"}`}>
        {socialLinks.map((link) => (
          <a
            key={link.brand}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-pelagic-mist bg-white font-semibold text-pelagic-charcoal shadow-sm transition hover:border-pelagic-gold hover:text-pelagic-gold sm:flex-none ${
              isFit ? "min-w-[calc(50%-0.25rem)] px-3 py-2 text-xs" : isPromo ? "px-4 py-3 text-sm" : "px-2.5 py-1.5 text-[11px]"
            }`}
          >
            <SocialBrandIcon brand={link.brand} size={isFit ? 16 : isPromo ? 20 : 14} />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
