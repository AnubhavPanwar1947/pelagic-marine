"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "/images/hero-port.jpg?v=3",
    alt: "Aerial view of a container ship assisted by tugs in harbour at golden hour",
    objectPosition: "62% 42%",
  },
  {
    src: "/images/contact-hero.jpg",
    alt: "Pelagic Marine consultant on the bridge overlooking port operations",
    objectPosition: "42% center",
  },
] as const;

const INTERVAL_MS = 7000;
const FADE_MS = 1400;

type HeroSlideshowProps = {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  showGradients?: boolean;
};

export function HeroSlideshow({
  className = "",
  imageClassName = "",
  priority = false,
  showGradients = true,
}: HeroSlideshowProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(
      () => setActive((current) => (current + 1) % SLIDES.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      {SLIDES.map((slide, index) => {
        const isActive = index === active;
        return (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={!isActive}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={isActive ? slide.alt : ""}
              width={2560}
              height={1440}
              fetchPriority={priority && index === 0 ? "high" : undefined}
              decoding="async"
              draggable={false}
              className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
              style={{ objectPosition: slide.objectPosition }}
            />
          </div>
        );
      })}

      {showGradients ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#071a33]/75 via-[#071a33]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/55 via-transparent to-[#071a33]/20" />
        </>
      ) : null}
    </div>
  );
}
