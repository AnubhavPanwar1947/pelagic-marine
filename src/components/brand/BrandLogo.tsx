import Image from "next/image";
import Link from "next/link";

const LOGO_CIRCLE_SRC = "/logo-circle.png?v=35";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
  shine?: boolean;
  navSolid?: boolean;
};

function BrandLogoWordmark({
  compact = false,
  promo = false,
  footer = false,
}: {
  compact?: boolean;
  promo?: boolean;
  footer?: boolean;
}) {
  return (
    <div
      className={`brand-logo-wordmark min-w-0 flex-col justify-center ${
        promo
          ? "brand-logo-wordmark--promo flex"
          : footer
            ? "brand-logo-wordmark--footer flex"
            : "hidden sm:flex"
      }`}
    >
      <span
        className={`brand-logo-wordmark-pelagic font-display block font-bold leading-none tracking-[0.05em] ${
          promo
            ? "text-3xl sm:text-4xl"
            : footer
              ? "text-base sm:text-lg"
              : compact
                ? "text-base"
                : "text-lg lg:text-xl"
        }`}
      >
        PELAGIC
      </span>
      <span
        className={`brand-logo-wordmark-tagline mt-1 block font-semibold uppercase leading-none tracking-[0.24em] ${
          promo
            ? "text-xs sm:text-sm"
            : footer
              ? "text-[9px] sm:text-[10px]"
              : compact
                ? "text-[9px]"
                : "text-[10px] lg:text-[11px]"
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
  const showWordmark = isHeader || isFooter || isPromo;
  const lockupShine = shine && showWordmark;

  const diameter = isPromo ? 200 : compact ? 92 : isFooter ? 88 : isHeader ? 100 : 96;

  const mark = (
    <div
      className="brand-logo-anchor-slot relative shrink-0"
      style={{ width: diameter, height: diameter }}
    >
      <div
        className={`brand-logo-circle absolute inset-0 inline-flex ${
          isPromo
            ? "brand-logo-circle--promo"
            : isHeader || isFooter
              ? "brand-logo-circle--header"
              : ""
        }`}
      >
        <div
          className={`brand-logo-shell brand-logo-shell--circle relative h-full w-full ${
            isPromo
              ? "brand-logo-shell--promo"
              : isHeader || isFooter
                ? "brand-logo-shell--header"
                : "bg-white"
          }`}
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
        </div>
      </div>
    </div>
  );

  const content = (
    <div
      className={`brand-logo-lockup relative inline-flex items-center${
        isPromo ? " brand-logo-lockup--promo" : ""
      }${isFooter ? " brand-logo-lockup--footer" : ""} ${lockupShine ? "brand-logo-lockup--shine" : ""}`}
    >
      {mark}
      {showWordmark && (
        <div className="brand-logo-wordmark-group inline-flex items-stretch">
          <span className="brand-logo-lockup-divider shrink-0" aria-hidden />
          <BrandLogoWordmark compact={compact} promo={isPromo} footer={isFooter} />
        </div>
      )}
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
