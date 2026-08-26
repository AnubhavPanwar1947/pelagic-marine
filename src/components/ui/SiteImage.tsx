"use client";

import { useState } from "react";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

type SiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  objectPosition?: string;
  /** Navy/gold wash so ship photos match the Pelagic brand palette */
  brandOverlay?: boolean;
};

export function SiteImage({
  src,
  alt,
  fill,
  priority,
  className = "",
  sizes,
  objectPosition,
  brandOverlay = false,
}: SiteImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br from-pelagic-sand via-pelagic-warm to-pelagic-accent/20 ${fill ? "absolute inset-0" : ""} ${className}`}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt === "" ? true : undefined}
        data-missing-image={src}
      />
    );
  }

  return (
    <div className={fill ? "absolute inset-0" : "relative"}>
      <ResponsiveImage
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        objectPosition={objectPosition}
        className={className}
        onError={() => {
          if (process.env.NODE_ENV === "development") {
            console.warn(`[SiteImage] Failed to load image: ${src}`);
          }
          setFailed(true);
        }}
      />
      {brandOverlay && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pelagic-charcoal/35 via-pelagic-steel/10 to-pelagic-accent/25 mix-blend-multiply"
          aria-hidden
        />
      )}
    </div>
  );
}
