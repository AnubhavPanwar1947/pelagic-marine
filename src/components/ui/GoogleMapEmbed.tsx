"use client";

import { MapBrandLoader } from "@/components/ui/MapBrandLoader";
import { useEffect, useState } from "react";

type GoogleMapEmbedProps = {
  src: string;
  title: string;
  className?: string;
  frameClassName?: string;
  eager?: boolean;
  compact?: boolean;
};

export function GoogleMapEmbed({
  src,
  title,
  className = "",
  frameClassName = "",
  eager = true,
  compact = false,
}: GoogleMapEmbedProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (src !== activeSrc) {
      setLoaded(false);
      setActiveSrc(src);
    }
  }, [src, activeSrc]);

  const showLoader = !mounted || !loaded;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {showLoader && (
        <div
          className="map-brand-overlay absolute inset-0 z-10 flex items-center justify-center p-4"
          aria-live="polite"
          aria-busy="true"
        >
          <MapBrandLoader compact={compact} />
        </div>
      )}
      <iframe
        title={title}
        src={activeSrc}
        loading={eager ? "eager" : "lazy"}
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={`office-map-frame absolute inset-0 h-full w-full border-0 ${frameClassName}`}
        allowFullScreen
      />
    </div>
  );
}
