"use client";

import { useEffect, useRef, useState } from "react";
import { SiteImage } from "@/components/ui/SiteImage";
import { siteImages, siteVideos } from "@/lib/site-images";

type HeroMediaProps = {
  className?: string;
  /** Full-bleed cinematic look (Enesel-style slow pan + dark overlay) */
  cinematic?: boolean;
};

export function HeroMedia({ className = "", cinematic = false }: HeroMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .then(() => setUseVideo(true))
      .catch(() => setUseVideo(false));

    const onError = () => setUseVideo(false);
    video.addEventListener("error", onError);
    return () => video.removeEventListener("error", onError);
  }, []);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 ${cinematic ? "hero-ken-burns" : ""}`}>
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            useVideo ? "opacity-100" : "opacity-0"
          } ${cinematic ? "scale-110" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          poster={siteImages.hero}
          aria-hidden
        >
          <source src={siteVideos.hero} type="video/mp4" />
        </video>

        {!useVideo && (
          <SiteImage
            src={siteImages.hero}
            alt="Vessel at sea — marine consultancy"
            fill
            priority
            className={`object-cover ${cinematic ? "scale-110" : ""}`}
            sizes="100vw"
          />
        )}
      </div>

      {cinematic ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-pelagic-navy/75 via-pelagic-navy/45 to-pelagic-navy/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-pelagic-ink/55 via-transparent to-pelagic-ink/25" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pelagic-cream to-transparent" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-pelagic-sky/30 via-transparent to-pelagic-cream/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-pelagic-cream/95 via-pelagic-cream/50 to-pelagic-cream/20 lg:from-pelagic-cream/90 lg:via-pelagic-cream/40 lg:to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-pelagic-water/20 to-transparent animate-wave-shimmer opacity-60" />
        </>
      )}
    </div>
  );
}
