import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  variant?: "header" | "footer" | "promo";
  linked?: boolean;
  compact?: boolean;
};

export function BrandLogo({
  variant = "header",
  linked = true,
  compact = false,
}: BrandLogoProps) {
  const isHeader = variant === "header";
  const isPromo = variant === "promo";

  const height = isPromo ? 140 : compact ? 48 : isHeader ? 64 : 56;

  const content = (
    <div className="group inline-flex shrink-0 transition-transform duration-300 group-hover:scale-[1.02]">
      <Image
        src="/logo.png?v=2"
        alt="Pelagic Marine Solutions"
        width={height}
        height={height}
        unoptimized
        className="h-auto w-auto object-contain"
        style={{ height, width: "auto", maxWidth: height * 1.15 }}
        priority={isHeader || isPromo}
      />
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
