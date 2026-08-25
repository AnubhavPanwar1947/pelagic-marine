import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { heroImage } from "@/lib/site-images";

/**
 * Fixed parallax backdrop for the Clients section on desktop.
 * Sits behind solid homepage sections; the hero section uses its own local
 * HeroMedia so crop is consistent at every viewport width.
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

/** Hero slideshow — always section-local so crop matches the hero box at every breakpoint */
export function HeroMedia({ className = "" }: { className?: string }) {
  return <HeroSlideshow className={className} priority />;
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
        className="object-cover home-hero-cover-img"
      />
      <div className="absolute inset-0 bg-[#071a33]/50" />
    </div>
  );
}
