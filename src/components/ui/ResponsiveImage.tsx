"use client";

import { useCallback, useState } from "react";
import type { CSSProperties } from "react";
import { buildPictureSources } from "@/lib/responsive-image";

type ResponsiveImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  style?: CSSProperties;
  objectPosition?: string;
  draggable?: boolean;
  loading?: "eager" | "lazy";
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
  objectPosition,
  draggable,
  loading: loadingProp,
  onError,
}: ResponsiveImageProps) {
  const [usePlainFallback, setUsePlainFallback] = useState(false);
  const picture = buildPictureSources(src);
  const hasModernSources = Boolean(picture.avifSrcSet || picture.webpSrcSet);
  const useSimpleImage = usePlainFallback || !hasModernSources;

  const handleError = useCallback(() => {
    if (!usePlainFallback && hasModernSources) {
      setUsePlainFallback(true);
      return;
    }
    onError?.();
  }, [usePlainFallback, hasModernSources, onError]);

  const imgClassName = fill ? `absolute inset-0 h-full w-full ${className}` : className;
  const imgStyle: CSSProperties = {
    ...style,
    ...(objectPosition ? { objectPosition } : {}),
  };

  const imgElementProps = {
    src: usePlainFallback ? src : picture.fallbackSrc,
    srcSet: usePlainFallback ? undefined : picture.fallbackSrcSet,
    sizes,
    draggable,
    loading: loadingProp ?? (priority ? ("eager" as const) : ("lazy" as const)),
    fetchPriority: priority ? ("high" as const) : undefined,
    decoding: "async" as const,
    onError: handleError,
    className: imgClassName,
    style: imgStyle,
    width: !fill ? picture.intrinsicWidth : undefined,
    height: !fill ? picture.intrinsicHeight : undefined,
  };

  if (useSimpleImage) {
    // eslint-disable-next-line @next/next/no-img-element -- static export uses pre-generated srcset
    return <img alt={alt} {...imgElementProps} />;
  }

  const pictureClassName = fill ? "absolute inset-0 block h-full w-full" : undefined;

  return (
    <picture className={pictureClassName}>
      {picture.avifSrcSet ? (
        <source type="image/avif" srcSet={picture.avifSrcSet} sizes={sizes} />
      ) : null}
      {picture.webpSrcSet ? (
        <source type="image/webp" srcSet={picture.webpSrcSet} sizes={sizes} />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export uses pre-generated srcset */}
      <img alt={alt} {...imgElementProps} />
    </picture>
  );
}
