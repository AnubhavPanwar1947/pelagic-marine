"use client";

import { useEffect, useState } from "react";
import { clientCompanies } from "@/lib/site-data";

const MARQUEE_CSS = `
@keyframes pelagic-marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes pelagic-marquee-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
.pelagic-client-marquee {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}
.pelagic-client-marquee-row {
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 6%, #000 94%, transparent);
}
.pelagic-client-marquee--quiet .pelagic-client-marquee-row {
  mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
}
.pelagic-client-marquee--full-width .pelagic-client-marquee-row {
  mask-image: none;
  -webkit-mask-image: none;
}
.pelagic-client-marquee-track {
  display: flex;
  width: max-content;
  gap: 0.875rem;
  will-change: transform;
}
.pelagic-client-marquee-track--left {
  animation: pelagic-marquee-left 44s linear infinite;
}
.pelagic-client-marquee-track--right {
  animation: pelagic-marquee-right 50s linear infinite;
}
.pelagic-client-marquee--quiet .pelagic-client-marquee-track--left {
  animation-duration: 78s;
}
.pelagic-client-marquee--quiet .pelagic-client-marquee-track--right {
  animation-duration: 86s;
}
.pelagic-client-marquee:hover .pelagic-client-marquee-track,
.pelagic-client-marquee:focus-within .pelagic-client-marquee-track {
  animation-play-state: paused;
}
@media (min-width: 640px) {
  .pelagic-client-marquee-track { gap: 1.125rem; }
}
@media (prefers-reduced-motion: reduce) {
  .pelagic-client-marquee-track--left,
  .pelagic-client-marquee-track--right {
    animation: none;
  }
}
`;

type ClientMarqueeVariant = "default" | "quiet";

type ClientMarqueeProps = {
  variant?: ClientMarqueeVariant;
  /** Use the full content-column width (About page). Homepage behavior unchanged. */
  fullWidth?: boolean;
  /** Override default client list — e.g. industry categories on About page */
  items?: readonly string[];
  /** About page: solid white cards with visible borders on a white section */
  whiteGaps?: boolean;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return reduced;
}

function chipClassName(variant: ClientMarqueeVariant, whiteGaps = false) {
  if (variant === "quiet") {
    return "inline-flex h-[3.5rem] w-[13.5rem] shrink-0 items-center justify-center rounded-xl border border-pelagic-mist bg-pelagic-cream/50 px-4 text-center text-[12px] font-medium tracking-[0.01em] text-pelagic-steel sm:h-[3.75rem] sm:w-[14.5rem] sm:text-[13px]";
  }

  if (whiteGaps) {
    return "inline-flex h-[4.25rem] w-[15rem] shrink-0 items-center justify-center rounded-2xl border border-[#c8d8e8] bg-white px-5 text-center text-[13px] font-semibold tracking-[0.02em] text-pelagic-ink shadow-[0_8px_28px_rgba(7,26,51,0.12)] sm:h-[4.75rem] sm:w-[16.5rem] sm:text-sm";
  }

  return "inline-flex h-[4.25rem] w-[15rem] shrink-0 items-center justify-center rounded-2xl border border-white/55 bg-white/90 px-5 text-center text-[13px] font-semibold tracking-[0.02em] text-pelagic-ink shadow-[0_8px_28px_rgba(7,26,51,0.12)] backdrop-blur-md sm:h-[4.75rem] sm:w-[16.5rem] sm:text-sm";
}

function MarqueeRow({
  names,
  direction,
  variant,
  whiteGaps,
}: {
  names: string[];
  direction: "left" | "right";
  variant: ClientMarqueeVariant;
  whiteGaps: boolean;
}) {
  const row = [...names, ...names];
  const chip = chipClassName(variant, whiteGaps);

  return (
    <div className="pelagic-client-marquee-row">
      <div
        className={`pelagic-client-marquee-track pelagic-client-marquee-track--${direction}`}
      >
        {row.map((name, index) => (
          <span key={`${direction}-${name}-${index}`} className={chip}>
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function StaticClientList({
  variant,
  items,
  whiteGaps,
}: {
  variant: ClientMarqueeVariant;
  items: readonly string[];
  whiteGaps: boolean;
}) {
  const chip = chipClassName(variant, whiteGaps);

  return (
    <ul className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {items.map((name) => (
        <li key={name}>
          <span className={chip}>{name}</span>
        </li>
      ))}
    </ul>
  );
}

export function ClientMarquee({
  variant = "default",
  fullWidth = false,
  items = clientCompanies,
  whiteGaps = false,
}: ClientMarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const midpoint = Math.ceil(items.length / 2);
  const rowOne = items.slice(0, midpoint);
  const rowTwo = items.slice(midpoint);

  const top = rowOne.length >= 4 ? rowOne : items;
  const bottom = rowTwo.length >= 4 ? rowTwo : [...items].reverse();

  const rootClass = [
    "pelagic-client-marquee relative w-full min-w-0 max-w-full overflow-hidden",
    variant === "quiet" ? "pelagic-client-marquee--quiet" : "",
    fullWidth ? "pelagic-client-marquee--full-width" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const surfaceClass = "relative z-[1] flex flex-col gap-3.5 sm:gap-4";

  if (reducedMotion) {
    return (
      <div className={rootClass} aria-label="Client companies">
        <div className={surfaceClass}>
          <StaticClientList variant={variant} items={items} whiteGaps={whiteGaps} />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClass} aria-label="Client companies">
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div className={surfaceClass}>
        <MarqueeRow names={top} direction="left" variant={variant} whiteGaps={whiteGaps} />
        <MarqueeRow names={bottom} direction="right" variant={variant} whiteGaps={whiteGaps} />
      </div>
    </div>
  );
}
