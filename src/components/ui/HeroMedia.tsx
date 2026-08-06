/**
 * Shared hero photo used as a fixed parallax backdrop for:
 * Hero → Delivery & Capability → (covered by solid sections) → Clients
 * Desktop only — mobile sections keep their own local image fills.
 */
export function HeroParallaxBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-port.jpg?v=3"
        alt=""
        width={2560}
        height={1440}
        className="h-full w-full object-cover object-[62%_42%]"
        decoding="async"
        draggable={false}
      />
      {/* Very light vignette so photo stays visible */}
      <div className="absolute inset-0 bg-[#071a33]/25" />
    </div>
  );
}

/** Local hero image for mobile (and as hero fill when fixed backdrop is off) */
export function HeroMedia({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] lg:hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-port.jpg?v=3"
        alt="Aerial view of a container ship assisted by tugs in harbour at golden hour"
        width={2560}
        height={1440}
        className="absolute inset-0 h-full w-full object-cover object-[62%_42%]"
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

/** Same photo as section fill — used on Delivery / Clients for mobile */
export function HeroSectionFill({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden lg:hidden ${className}`} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-port.jpg?v=3"
        alt=""
        width={2560}
        height={1440}
        className="absolute inset-0 h-full w-full object-cover object-[62%_42%]"
        decoding="async"
        draggable={false}
      />
      <div className="absolute inset-0 bg-[#071a33]/45" />
    </div>
  );
}
