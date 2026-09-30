"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";

const trackRecordStats = [
  {
    value: "680+",
    label: "Total projects delivered",
  },
  {
    value: "28+",
    label: "Project cargo carriages",
  },
  {
    value: "120+",
    label: "Detailed engineering studies",
  },
  {
    value: "160+",
    label: "Stability assessments",
  },
] as const;

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

function TrackRecordStatValue({
  value,
  label,
  active,
  delay,
}: {
  value: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const { number, suffix } = parseStatValue(value);
  const count = useCountUp(active, number, 1800 + delay);

  return (
    <p
      className="home-track-record__value tabular-nums"
      aria-label={`${value} ${label}`}
    >
      {active ? `${count}${suffix}` : `0${suffix}`}
    </p>
  );
}

export function HomeTrackRecordSection() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      className="home-track-record relative z-[1] overflow-x-clip border-b border-pelagic-sand section-py"
      aria-labelledby="home-track-record-heading"
    >
      <div className="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <Reveal variant="text">
          <div className="home-track-record__intro min-w-0 max-w-4xl">
            <p className="home-track-record__eyebrow">TRACK RECORD</p>
            <h2
              id="home-track-record-heading"
              className="home-track-record__title type-display type-section-title mt-5 min-w-0 break-words"
            >
              Proven across the fleet, port to port.
            </h2>
            <p className="home-track-record__description mt-5 min-w-0 max-w-3xl break-words">
              A register of representative assignments — the breadth of vessels, tools and fuels
              Pelagic Marine has engineered, analysed and surveyed for owners, operators and
              charterers.
            </p>
          </div>
        </Reveal>

        <Reveal variant="card" delay={80} className="mt-10 sm:mt-12 lg:mt-14">
          <div ref={ref} className="home-track-record__panel min-w-0">
            <ul className="home-track-record__stats list-none p-0">
              {trackRecordStats.map((stat, index) => (
                <li key={stat.label} className="home-track-record__stat min-w-0">
                  <TrackRecordStatValue
                    value={stat.value}
                    label={stat.label}
                    active={inView}
                    delay={index * 80}
                  />
                  <p className="home-track-record__label">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
