"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const PROJECT_COUNT = 1280;
const COUNT_DURATION_MS = 3800;

function useCountUp(active: boolean, target: number, durationMs: number) {
  const [value, setValue] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let frame = 0;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setValue(Math.round(eased * target));
      setProgress(eased);

      if (elapsed < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, durationMs, target]);

  return { value, progress };
}

export function ProjectsCapabilitiesCard() {
  const [visible, setVisible] = useState(false);
  const { value: count, progress } = useCountUp(visible, PROJECT_COUNT, COUNT_DURATION_MS);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`animate-fade-up ${visible ? "" : "opacity-0"}`}>
      <div className="grid gap-10 lg:grid-cols-[1.45fr_auto] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="type-eyebrow">Delivery & capability</p>
          <h2 className="type-display mt-4 text-3xl leading-[1.08] text-pelagic-ink sm:text-4xl lg:text-5xl">
            Proven on projects.
            <span className="mt-1 block text-pelagic-accent">Ready with the right tools.</span>
          </h2>
          <p className="type-lead mt-5 max-w-2xl">
            From survey scopes to structural analysis and class-approved loading tools — work
            backed by licensed suites and sea-proven judgement.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xs text-center lg:mx-0 lg:pb-1 lg:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pelagic-slate">
            Projects handled
          </p>
          <p
            className="type-display mt-2 text-6xl leading-none text-pelagic-accent tabular-nums sm:text-7xl"
            aria-live="polite"
            aria-label={`${PROJECT_COUNT.toLocaleString()} projects handled`}
          >
            {count.toLocaleString()}
            <span>+</span>
          </p>
          <div
            className="mx-auto mt-4 h-1 max-w-[12rem] overflow-hidden rounded-full bg-pelagic-sand lg:mx-0"
            aria-hidden
          >
            <span
              className="block h-full w-full origin-left rounded-full bg-pelagic-accent transition-transform duration-75 ease-linear"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <Link
            href="/capabilities"
            className="mt-5 inline-block text-sm font-semibold text-pelagic-accent hover:underline"
          >
            All capabilities →
          </Link>
        </div>
      </div>
    </div>
  );
}
