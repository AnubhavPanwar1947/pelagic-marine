"use client";

import { useEffect, useRef } from "react";
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
}
.pelagic-client-marquee-row {
  overflow: hidden;
}
.pelagic-client-marquee-track {
  display: flex;
  width: max-content;
  gap: 1rem;
  will-change: transform;
}
.pelagic-client-marquee-track--left {
  animation: pelagic-marquee-left 42s linear infinite;
}
.pelagic-client-marquee-track--right {
  animation: pelagic-marquee-right 48s linear infinite;
}
.pelagic-client-marquee:hover .pelagic-client-marquee-track {
  animation-play-state: paused;
}
@media (min-width: 640px) {
  .pelagic-client-marquee-track { gap: 1.25rem; }
}
@media (prefers-reduced-motion: reduce) {
  .pelagic-client-marquee-track--left,
  .pelagic-client-marquee-track--right {
    animation: none;
  }
}
`;

function MarqueeRow({
  names,
  direction,
}: {
  names: string[];
  direction: "left" | "right";
}) {
  const row = [...names, ...names];

  return (
    <div className="pelagic-client-marquee-row">
      <div
        className={`pelagic-client-marquee-track pelagic-client-marquee-track--${direction}`}
      >
        {row.map((name, index) => (
          <span
            key={`${direction}-${name}-${index}`}
            className="inline-flex h-[4.5rem] w-[15.5rem] shrink-0 items-center justify-center rounded-2xl border border-pelagic-sand/90 bg-white px-5 text-center text-sm font-semibold tracking-wide text-pelagic-ink sm:h-[5.25rem] sm:w-[17.5rem] sm:text-[15px]"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  const shadeRef = useRef<HTMLDivElement>(null);
  const midpoint = Math.ceil(clientCompanies.length / 2);
  const rowOne = clientCompanies.slice(0, midpoint);
  const rowTwo = clientCompanies.slice(midpoint);

  const top = rowOne.length >= 4 ? rowOne : clientCompanies;
  const bottom = rowTwo.length >= 4 ? rowTwo : [...clientCompanies].reverse();

  useEffect(() => {
    const shade = shadeRef.current;
    if (!shade) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = shade.closest("section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      const progress = Math.min(Math.max((viewH - rect.top) / (viewH + rect.height), 0), 1);
      const offset = (progress - 0.5) * 36;
      shade.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="pelagic-client-marquee relative overflow-hidden"
      aria-label="Client companies"
    >
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />

      {/* Soft parallax shade — same mist tone as section, synced with scroll */}
      <div
        ref={shadeRef}
        className="pointer-events-none absolute -inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-pelagic-mist/50 via-transparent to-pelagic-sky/40 will-change-transform"
        aria-hidden
      />

      <div className="relative z-[1] flex flex-col gap-4 sm:gap-5">
        <MarqueeRow names={top} direction="left" />
        <MarqueeRow names={bottom} direction="right" />
      </div>
    </div>
  );
}
