import Image from "next/image";
import Link from "next/link";

const LOGO_CIRCLE_SRC = "/logo-circle.png?v=32";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
  shine?: boolean;
  /** Matches header `bg-white` vs `bg-white/90` when scrolled state changes */
  navSolid?: boolean;
};

function BrandLogoWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand-logo-wordmark hidden min-w-0 flex-col justify-center sm:flex">
      <span
        className={`brand-logo-wordmark-pelagic font-display block font-bold leading-none tracking-[0.05em] ${
          compact ? "text-base" : "text-lg lg:text-xl"
        }`}
      >
        PELAGIC
      </span>
      <span
        className={`brand-logo-wordmark-tagline mt-1 block font-semibold uppercase leading-none tracking-[0.24em] ${
          compact ? "text-[9px]" : "text-[10px] lg:text-[11px]"
        }`}
      >
        Marine Solutions
      </span>
    </div>
  );
}

export function BrandLogo({
  variant = "header",
  linked = true,
  compact = false,
  shine = false,
  navSolid = true,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const isPromo = variant === "promo";
  const isFooter = variant === "footer";
  const showWordmark = isHeader || isFooter;
  const lockupShine = showWordmark && (shine || isHeader || isFooter);
  const markShine = shine && !showWordmark;

  const diameter = isPromo ? 300 : compact ? 92 : isHeader ? 124 : 96;

  const headerSurface = navSolid ? "bg-white" : "bg-white/90 backdrop-blur-md";

  const mark = (
    <div
      className={`brand-logo-circle group relative inline-flex shrink-0 transition-transform duration-300 group-hover:scale-[1.02] ${
        isPromo
          ? "brand-logo-circle--splash"
          : isHeader
            ? `brand-logo-circle--header ${headerSurface}`
            : ""
      }`}
      style={{ width: diameter, height: diameter }}
    >
      <div
        className={`brand-logo-shell brand-logo-shell--circle relative h-full w-full ${isHeader ? headerSurface : isPromo ? "bg-[#fdfbf7]" : "bg-white"} ${markShine ? "brand-logo-shine" : ""}`}
      >
        <Image
          src={LOGO_CIRCLE_SRC}
          alt=""
          width={diameter}
          height={diameter}
          unoptimized
          className="brand-logo-img brand-logo-img--circle absolute inset-0 z-[1] h-full w-full object-contain object-center"
          priority={isHeader || isPromo}
        />
        {markShine && (
          <>
            <span className="brand-logo-armor-rim pointer-events-none absolute inset-0 z-[2]" aria-hidden />
            <span className="brand-logo-armor-glint pointer-events-none absolute inset-0 z-[3]" aria-hidden />
            <span className="brand-logo-shine-sweep pointer-events-none absolute inset-0 z-[4]" aria-hidden />
          </>
        )}
      </div>
    </div>
  );

  const content = (
    <div
      className={`brand-logo-lockup relative inline-flex items-center gap-2.5 sm:gap-3 ${
        lockupShine ? "brand-logo-lockup--shine" : ""
      }`}
    >
      {mark}
      {showWordmark && <BrandLogoWordmark compact={compact} />}
      {lockupShine && (
        <span className="brand-logo-lockup-shine-sweep pointer-events-none" aria-hidden />
      )}
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="group inline-flex rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
        aria-label="Pelagic Marine Solutions — home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
