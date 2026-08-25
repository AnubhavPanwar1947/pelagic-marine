"use client";

import { useEffect, useState } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { heroSlides } from "@/lib/site-images";

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
    if (reduced || heroSlides.length < 2) return;

    const id = window.setInterval(
      () => setActive((current) => (current + 1) % heroSlides.length),
      INTERVAL_MS
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      {heroSlides.map((slide, index) => {
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
            <ResponsiveImage
              src={slide.src}
              alt={isActive ? slide.alt : ""}
              fill
              priority={priority && index === 0}
              sizes="100vw"
              draggable={false}
              className={`object-cover home-hero-cover-img${
                index === 1 ? " home-hero-cover-img--port" : ""
              } ${imageClassName}`}
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
