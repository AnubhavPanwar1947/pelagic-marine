/**
 * Full-bleed hero image with desktop-only fixed (scroll-over) background.
 * Mobile stays normal absolute cover — avoids iOS fixed-bg bugs.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <div className={`hero-media-root absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      <div className="hero-media-fixed">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-port.jpg?v=2"
          alt="Aerial view of a container ship assisted by tugs in harbour at golden hour"
          width={2560}
          height={1440}
          className="absolute inset-0 h-full w-full object-cover object-[62%_42%]"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
      </div>
    </div>
  );
}
