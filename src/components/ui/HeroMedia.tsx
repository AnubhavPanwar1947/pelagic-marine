import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { heroImage } from "@/lib/site-images";

/**
 * Shared hero photo used as a fixed parallax backdrop for:
 * Hero → (solid sections cover) → Clients
 * Desktop only — mobile sections keep their own local image fills.
 */
export function HeroParallaxBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      aria-hidden
    >
      <HeroSlideshow
        showGradients={false}
        imageClassName="home-hero-backdrop-img"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071a33]/55 via-[#071a33]/20 to-[#071a33]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/45 via-transparent to-[#071a33]/15" />
    </div>
  );
}

/** Local hero image for mobile (and as hero fill when fixed backdrop is off) */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <HeroSlideshow
      className={`lg:hidden ${className}`}
      priority
    />
  );
}

/** Same photo as hero — used on Clients for mobile */
export function HeroSectionFill({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden lg:hidden ${className}`} aria-hidden>
      <ResponsiveImage
        src={heroImage.src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: heroImage.objectPosition }}
      />
      <div className="absolute inset-0 bg-[#071a33]/50" />
    </div>
  );
}
