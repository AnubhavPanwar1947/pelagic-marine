"use client";

import { useEffect, useState } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition, heroSlides } from "@/lib/site-images";

const HOLD_MS = 5000;
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
    if (heroSlides.length < 2) return;

    const frame = requestAnimationFrame(() => {
      for (let i = 1; i < heroSlides.length; i += 1) {
        const img = new window.Image();
        img.src = heroSlides[i].src;
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || heroSlides.length < 2) return;

    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % heroSlides.length);
    }, HOLD_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      {heroSlides.map((slide, index) => {
        const isActive = index === active;
        const isLcpCandidate = priority && index === 0;
        const objectPosition = getImageObjectPosition(slide.src);
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
              priority={isLcpCandidate}
              loading={index === 0 ? undefined : "eager"}
              sizes={imageSizes.fullViewport}
              draggable={false}
              objectPosition={objectPosition}
              className={`object-cover home-hero-cover-img ${imageClassName}`}
            />
          </div>
        );
      })}

      {showGradients ? (
        <>
          <div className="home-hero-scrim-left absolute inset-0" aria-hidden />
          <div className="home-hero-scrim-top absolute inset-0" aria-hidden />
          <div className="home-hero-scrim-bottom absolute inset-0" aria-hidden />
        </>
      ) : null}
    </div>
  );
}
