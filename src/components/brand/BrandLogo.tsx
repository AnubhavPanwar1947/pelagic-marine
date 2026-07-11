import Image from "next/image";
import Link from "next/link";

/** Cropped emblem — header (PELAGIC → waves) */
const EMBLEM_ASPECT = 1.16;
const LOGO_SRC = "/logo.png?v=17";

/** Full Final.pdf lockup — splash (includes MARINE SOLUTIONS) */
const FULL_ASPECT = 1.46;
const LOGO_FULL_SRC = "/logo-full.png?v=17";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
  shine?: boolean;
};

export function BrandLogo({
  variant = "header",
  linked = true,
  compact = false,
  shine = true,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const isPromo = variant === "promo";

  const useFull = isPromo;
  const aspect = useFull ? FULL_ASPECT : EMBLEM_ASPECT;
  const src = useFull ? LOGO_FULL_SRC : LOGO_SRC;

  const height = useFull ? 240 : compact ? 74 : isHeader ? 106 : 92;
  const width = Math.round(height / aspect);

  const content = (
    <div
      className="group relative inline-flex shrink-0 transition-transform duration-300 group-hover:scale-[1.02]"
      style={{ width, height }}
    >
      <div
        className={`brand-logo-shell relative h-full w-full overflow-visible ${useFull ? "brand-logo-shell--full" : ""} ${shine ? "brand-logo-shine" : ""}`}
      >
        <Image
          src={src}
          alt="Pelagic Marine Solutions"
          width={width}
          height={height}
          unoptimized
          className="brand-logo-img relative z-[1] h-full w-full object-contain object-center"
          priority={isHeader || isPromo}
        />
        {shine && (
          <>
            <span className="brand-logo-armor-rim pointer-events-none absolute inset-0 z-[2]" aria-hidden />
            <span className="brand-logo-armor-glint pointer-events-none absolute inset-0 z-[3]" aria-hidden />
            <span className="brand-logo-shine-sweep pointer-events-none absolute inset-0 z-[4]" aria-hidden />
          </>
        )}
      </div>
    </div>
  );

  if (linked) {
    return (
      <Link
        href="/"
        className="inline-flex rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-pelagic-accent"
        aria-label="Pelagic Marine Solutions — home"
      >
        {content}
      </Link>
    );
  }

  return content;
}
