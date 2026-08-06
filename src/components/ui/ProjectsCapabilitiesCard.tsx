"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const PROJECT_COUNT = 1280;
const COUNT_DURATION_MS = 3200;
const TOOLS = ["ANSYS", "NAPA", "Optimoor", "UMISTAB-X", "SACS", "AutoHydro"];

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
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { value: count, progress } = useCountUp(visible, PROJECT_COUNT, COUNT_DURATION_MS);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={visible ? "animate-fade-up" : "opacity-0"}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_auto] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="type-eyebrow">Delivery & capability</p>
          <h2 className="type-display mt-4 text-3xl leading-[1.06] text-pelagic-ink sm:text-4xl lg:text-[2.85rem]">
            Proven on projects.
            <span className="mt-1.5 block text-heading-accent">
              Ready with the right tools.
            </span>
          </h2>
          <p className="type-lead mt-5 max-w-2xl text-pelagic-steel">
            From survey scopes to structural analysis and class-approved loading
            tools — work backed by licensed suites and sea-proven judgement.
          </p>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Software and tools">
            {TOOLS.map((tool) => (
              <li
                key={tool}
                className="rounded-full border border-pelagic-sand bg-white/90 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.06em] text-pelagic-navy"
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[15rem] text-center lg:mx-0 lg:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-pelagic-slate">
            Projects handled
          </p>
          <p
            className="type-display mt-2 text-6xl leading-none text-pelagic-accent tabular-nums sm:text-7xl lg:text-[4.75rem]"
            aria-live="polite"
            aria-label={`${PROJECT_COUNT.toLocaleString()} projects handled`}
          >
            {count.toLocaleString()}
            <span className="text-pelagic-accent/70">+</span>
          </p>
          <div
            className="mx-auto mt-5 h-[3px] max-w-[11rem] overflow-hidden rounded-full bg-pelagic-sand lg:mx-0"
            aria-hidden
          >
            <span
              className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-pelagic-accent to-pelagic-blue transition-transform duration-75 ease-linear"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <Link
            href="/capabilities"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pelagic-accent transition hover:gap-2.5"
          >
            All capabilities
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
