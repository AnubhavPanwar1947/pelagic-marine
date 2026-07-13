"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

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

export function HeroProjectsCard() {
  const [visible, setVisible] = useState(false);
  const { value: count, progress } = useCountUp(visible, PROJECT_COUNT, COUNT_DURATION_MS);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`animate-fade-up ${visible ? "" : "opacity-0"}`}>
      <div className="card-premium card-maritime flex flex-col gap-5 rounded-3xl border px-6 py-5 shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-8 sm:py-6">
        <p className="type-display text-xl text-pelagic-ink sm:text-2xl">
          Projects handled
        </p>

        <div
          className="hidden w-px shrink-0 self-stretch bg-pelagic-sand sm:block"
          aria-hidden
        />

        <div className="flex flex-wrap items-center gap-4 sm:gap-5">
          <div className="min-w-[8.5rem]">
            <p
              className="type-display text-4xl leading-none text-pelagic-accent tabular-nums sm:text-5xl"
              aria-live="polite"
              aria-label={`${PROJECT_COUNT.toLocaleString()} projects handled`}
            >
              {count.toLocaleString()}
              <span className="text-pelagic-accent">+</span>
            </p>
            <div
              className="mt-2 h-0.5 overflow-hidden rounded-full bg-pelagic-sand"
              aria-hidden
            >
              <span
                className="block h-full w-full origin-left rounded-full bg-pelagic-accent transition-transform duration-75 ease-linear"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
          </div>

          <Button href="/projects" variant="outline" className="px-6 py-3">
            Know more
          </Button>
        </div>
      </div>
    </div>
  );
}
