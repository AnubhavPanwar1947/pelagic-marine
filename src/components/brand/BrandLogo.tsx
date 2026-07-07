import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "header" | "footer";
  linked?: boolean;
};

export function BrandLogo({ variant = "header", linked = true }: BrandLogoProps) {
  const isHeader = variant === "header";
  const logoSize = isHeader ? 54 : 44;
  const nameSize = isHeader
    ? "text-lg sm:text-xl md:text-2xl"
    : "text-lg font-semibold";

  const content = (
    <div className="group flex items-center gap-3 sm:gap-3.5">
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-[1.03]">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-pelagic-gold/50 via-pelagic-gold-light/30 to-pelagic-gold/50 blur-md opacity-80" />
        <div className="logo-armor relative rounded-full p-[3px] shadow-lg shadow-pelagic-gold/25">
          <div className="logo-armor-shine pointer-events-none absolute inset-0 z-20 rounded-full" />
          <div className="relative overflow-hidden rounded-full bg-gradient-to-br from-white via-pelagic-sand to-white p-0.5 ring-1 ring-pelagic-gold/70 ring-offset-1 ring-offset-white">
            <Image
              src="/logo.svg"
              alt="Pelagic Marine Consultants"
              width={logoSize}
              height={logoSize}
              className="relative z-10 rounded-full contrast-[1.08] saturate-[1.05]"
              priority
            />
          </div>
        </div>
      </div>

      <div className="min-w-0 leading-none">
        <p
          className={`font-display font-bold tracking-[0.06em] text-pelagic-ink ${nameSize}`}
        >
          PELAGIC
        </p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-pelagic-gold sm:text-[10px]">
          Marine Consultants
        </p>
      </div>
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="inline-flex rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-gold"
      >
        {content}
      </Link>
    );
  }

  return content;
}
