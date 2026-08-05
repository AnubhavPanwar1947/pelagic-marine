"use client";

import { useEffect, useRef, useState } from "react";
import { siteVideos } from "@/lib/site-images";

/**
 * Cinematic hero media.
 * HD aerial still is always the sharp base; ambient port video fades in when it can play.
 */
export function HeroMedia({ className = "" }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = async () => {
      try {
        video.defaultMuted = true;
        video.muted = true;
        await video.play();
        if (!cancelled) setVideoReady(true);
      } catch {
        if (!cancelled) setVideoReady(false);
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", tryPlay);
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#071a33] ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-port.jpg?v=1"
        alt="Aerial view of a container ship assisted by tugs in harbour at golden hour"
        width={2560}
        height={1440}
        className={`absolute inset-0 h-full w-full object-cover object-[62%_42%] hero-ken-burns ${
          videoReady ? "opacity-0" : "opacity-100"
        } transition-opacity duration-[1200ms]`}
        fetchPriority="high"
        decoding="async"
        draggable={false}
      />

      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover object-[center_40%] transition-opacity duration-[1200ms] ${
          videoReady ? "opacity-100" : "opacity-0"
        }`}
        poster="/images/hero-port.jpg?v=1"
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
        tabIndex={-1}
      >
        <source src={`${siteVideos.hero}?v=1`} type="video/mp4" />
      </video>
    </div>
  );
}
