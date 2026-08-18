import type { CSSProperties } from "react";
import { buildSrcSet, defaultResponsiveSrc } from "@/lib/responsive-image";

type ResponsiveImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  style?: CSSProperties;
  draggable?: boolean;
  onError?: () => void;
};

export function ResponsiveImage({
  src,
  alt,
  fill = false,
  priority = false,
  className = "",
  sizes,
  style,
  draggable,
  onError,
}: ResponsiveImageProps) {
  const srcSet = buildSrcSet(src);
  const resolvedSrc = srcSet ? defaultResponsiveSrc(src) : src;

  return (
  // eslint-disable-next-line @next/next/no-img-element -- static export uses pre-generated srcset, not next/image optimization
    <img
      src={resolvedSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      draggable={draggable}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={onError}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
      style={style}
    />
  );
}
