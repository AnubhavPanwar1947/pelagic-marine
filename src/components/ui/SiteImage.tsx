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
};

export function SiteImage({
  src,
  alt,
  fill,
  priority,
  className = "",
  sizes,
}: SiteImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br from-pelagic-sand via-pelagic-warm to-pelagic-gold/20 ${fill ? "absolute inset-0" : ""} ${className}`}
        aria-hidden={alt === ""}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
