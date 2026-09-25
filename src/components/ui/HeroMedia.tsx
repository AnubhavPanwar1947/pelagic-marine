"use client";

import { useEffect, useRef, useState } from "react";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import { imageSizes } from "@/lib/image-sizes";
import { heroImage } from "@/lib/site-images";

/**
 * Fixed parallax backdrop for the Clients section on desktop.
 * Uses a single static hero frame (with drift CSS) so the same slides are not
 * decoded twice alongside HeroMedia's slideshow.
 */
export function HeroParallaxBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 hidden lg:block"
      aria-hidden
    >
      <div className="absolute inset-0 overflow-hidden bg-[#071a33]">
        <ResponsiveImage
          src={heroImage.src}
          alt=""
          fill
          sizes={imageSizes.fullViewport}
          className="object-cover home-hero-cover-img home-hero-backdrop-img"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#071a33]/55 via-[#071a33]/20 to-[#071a33]/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/45 via-transparent to-[#071a33]/15" />
    </div>
  );
}

function supportsFixedBackground() {
  if (typeof document === "undefined") return true;
  const probe = document.createElement("div");
  probe.style.backgroundAttachment = "fixed";
  return probe.style.backgroundAttachment === "fixed";
}

/** Hero slideshow with homepage-only fixed parallax (image layer, not copy). */
export function HeroMedia({ className = "" }: { className?: string }) {
  const layerRef = useRef<HTMLDivElement>(null);
  const [parallaxMode, setParallaxMode] = useState<"fixed" | "scroll">("scroll");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsFixedBackground()) {
      setParallaxMode("scroll");
      return;
    }
    setParallaxMode("fixed");
  }, []);

  useEffect(() => {
    if (parallaxMode !== "fixed") return;

    const layer = layerRef.current;
    const section = layer?.closest(".home-hero-section");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        layer?.classList.toggle(
          "home-hero-parallax-layer--hidden",
          !entry.isIntersecting,
        );
      },
      { threshold: 0 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [parallaxMode]);

  const layerClass =
    parallaxMode === "fixed"
      ? "home-hero-parallax-layer home-hero-parallax-layer--fixed"
      : "home-hero-parallax-layer home-hero-parallax-layer--scroll";

  return (
    <div ref={layerRef} className={`${layerClass} ${className}`} aria-hidden>
      <HeroSlideshow priority className="home-hero-parallax-slideshow" />
    </div>
  );
}

/** Same photo as hero — used on Clients for mobile */
export function HeroSectionFill({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden lg:hidden ${className}`} aria-hidden>
      <ResponsiveImage
        src={heroImage.src}
        alt=""
        fill
        sizes={imageSizes.fullViewport}
        className="object-cover home-hero-cover-img"
      />
      <div className="absolute inset-0 bg-[#071a33]/50" />
    </div>
  );
}
