"use client";

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
            className="inline-flex h-[4.5rem] w-[15.5rem] shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-white/92 px-5 text-center text-sm font-semibold tracking-wide text-pelagic-ink backdrop-blur-sm sm:h-[5.25rem] sm:w-[17.5rem] sm:text-[15px]"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ClientMarquee() {
  const midpoint = Math.ceil(clientCompanies.length / 2);
  const rowOne = clientCompanies.slice(0, midpoint);
  const rowTwo = clientCompanies.slice(midpoint);

  const top = rowOne.length >= 4 ? rowOne : clientCompanies;
  const bottom = rowTwo.length >= 4 ? rowTwo : [...clientCompanies].reverse();

  return (
    <div
      className="pelagic-client-marquee relative"
      aria-label="Client companies"
    >
      <style dangerouslySetInnerHTML={{ __html: MARQUEE_CSS }} />
      <div className="relative z-[1] flex flex-col gap-4 sm:gap-5">
        <MarqueeRow names={top} direction="left" />
        <MarqueeRow names={bottom} direction="right" />
      </div>
    </div>
  );
}
