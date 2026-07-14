"use client";

import Image from "next/image";
import { useState } from "react";

type SiteImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
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
  brandOverlay = false,
}: SiteImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br from-pelagic-sand via-pelagic-warm to-pelagic-accent/20 ${fill ? "absolute inset-0" : ""} ${className}`}
        aria-hidden={alt === ""}
      />
    );
  }

  return (
    <div className={fill ? "absolute inset-0" : "relative"}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={className}
        onError={() => setFailed(true)}
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
