"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

type Stat = {
  value: string;
  label: string;
};

function parseStatValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return { number: 0, suffix: value };
  return { number: Number(match[1]), suffix: match[2] };
}

function useCountUp(active: boolean, target: number, durationMs = 1800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    let start: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(eased * target));

      if (elapsed < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, target]);

  return value;
}

function StatCell({
  stat,
  active,
  delay,
}: {
  stat: Stat;
  active: boolean;
  delay: number;
}) {
  const { number, suffix } = parseStatValue(stat.value);
  const count = useCountUp(active, number, 1800 + delay);

  return (
    <div className="bg-white/95 px-4 py-6 text-center sm:px-5 sm:py-7">
      <p
        className="type-display text-2xl text-pelagic-accent tabular-nums sm:text-3xl"
        aria-label={`${stat.value} ${stat.label}`}
      >
        {active ? `${count}${suffix}` : `0${suffix}`}
      </p>
      <p className="type-muted mt-2 leading-snug">{stat.label}</p>
    </div>
  );
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="home-stats-band grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-pelagic-sand bg-pelagic-sand sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5"
    >
      {stats.map((stat, index) => (
        <StatCell key={stat.label} stat={stat} active={inView} delay={index * 80} />
      ))}
    </div>
  );
}
