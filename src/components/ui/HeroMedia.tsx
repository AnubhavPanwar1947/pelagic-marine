"use client";

import { useEffect, useRef } from "react";

/**
 * Full-bleed hero photo.
 * Uses object-cover (never stretch) so the image stays sharp and undistorted.
 * Soft vertical parallax only — no CSS scale (scale softens/blurs the photo).
 *
 * Ideal source file for this container:
 * - Aspect: 16:9 (same as current hero.jpg 2400×1350)
 * - Size: 2560×1440 minimum, 3840×2160 preferred for retina displays
 * - Format: JPG/WebP, good quality export (not over-compressed)
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const section = image.closest("section");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight || 1;
      const progress = Math.min(Math.max(-rect.top / sectionHeight, 0), 1);
      // Extra height on the img (115%) gives room to shift without scaling
      const maxShift = sectionHeight * 0.12;
      const offset = progress * maxShift;
      image.style.transform = `translate3d(0, ${offset}px, 0)`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-pelagic-navy ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src="/images/hero.jpg?v=bridge-4"
        alt="Pelagic Marine surveyor on the bridge overlooking harbour operations"
        width={2400}
        height={1350}
        className="absolute left-0 top-0 h-[115%] w-full max-w-none object-cover object-[center_40%]"
        style={{ transform: "translate3d(0, 0, 0)" }}
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
