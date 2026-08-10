"use client";

import { useEffect, useRef, useState } from "react";

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

function StatCell({ stat, active, delay }: { stat: Stat; active: boolean; delay: number }) {
  const { number, suffix } = parseStatValue(stat.value);
  const count = useCountUp(active, number, 1800 + delay);

  return (
    <div className="bg-white/95 px-4 py-6 text-center sm:px-5 sm:py-7">
      <p className="type-display text-2xl text-pelagic-accent tabular-nums sm:text-3xl">
        {active ? `${count}${suffix}` : `0${suffix}`}
      </p>
      <p className="type-muted mt-2 leading-snug">{stat.label}</p>
    </div>
  );
}

export function StatsBand({ stats }: { stats: Stat[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: reduced ? 0.1 : 0.32, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={`home-stats-band grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] border border-pelagic-sand bg-pelagic-sand transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] sm:grid-cols-3 lg:grid-cols-5 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0"
      }`}
    >
      {stats.map((stat, index) => (
        <StatCell key={stat.label} stat={stat} active={visible} delay={index * 80} />
      ))}
    </div>
  );
}
