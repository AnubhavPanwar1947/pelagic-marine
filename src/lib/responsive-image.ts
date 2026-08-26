import {
  imageManifest,
  type ImageManifestEntry,
  type ImageVariant,
} from "./image-manifest.generated";

export const RESPONSIVE_WIDTHS = [320, 480, 640, 960, 1280, 1920] as const;

export type PictureSources = {
  avifSrcSet?: string;
  webpSrcSet?: string;
  fallbackSrc: string;
  fallbackSrcSet?: string;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
};

function buildSrcSetFromVariants(variants: ImageVariant[]): string | undefined {
  if (!variants.length) return undefined;
  return variants.map((v) => `${v.path} ${v.width}w`).join(", ");
}

function largestVariant(variants: ImageVariant[]): ImageVariant | undefined {
  return variants.reduce<ImageVariant | undefined>(
    (best, v) => (!best || v.width > best.width ? v : best),
    undefined,
  );
}

export function getManifestEntry(src: string): ImageManifestEntry | undefined {
  const normalized = src.startsWith("/") ? src : `/${src}`;
  return imageManifest[normalized];
}

export function isLocalImage(src: string): boolean {
  return src.startsWith("/") && !src.startsWith("//");
}

export function isRemoteImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//");
}

function parseUnsplashDimensions(src: string): { maxWidth: number; aspectRatio?: number } {
  try {
    const url = new URL(src);
    const w = Number(url.searchParams.get("w") || url.searchParams.get("width") || 0);
    const h = Number(url.searchParams.get("h") || url.searchParams.get("height") || 0);
    const maxWidth = w > 0 ? w : 1920;
    const aspectRatio = w > 0 && h > 0 ? h / w : undefined;
    return { maxWidth, aspectRatio };
  } catch {
    return { maxWidth: 1920 };
  }
}

function buildRemoteSrcSet(src: string): string | undefined {
  if (!isRemoteImage(src)) return undefined;

  const { maxWidth, aspectRatio } = parseUnsplashDimensions(src);
  const widths = RESPONSIVE_WIDTHS.filter((w) => w <= maxWidth);
  if (!widths.length) return undefined;

  const base = src.split("?")[0];
  return widths
    .map((width) => {
      const params = new URLSearchParams({
        auto: "format",
        fit: "crop",
        w: String(width),
        q: "88",
      });
      if (aspectRatio) {
        params.set("h", String(Math.round(width * aspectRatio)));
      }
      return `${base}?${params.toString()} ${width}w`;
    })
    .join(", ");
}

function defaultRemoteSrc(src: string): string {
  const { maxWidth, aspectRatio } = parseUnsplashDimensions(src);
  const width = Math.min(1280, maxWidth);
  const base = src.split("?")[0];
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    w: String(width),
    q: "88",
  });
  if (aspectRatio) {
    params.set("h", String(Math.round(width * aspectRatio)));
  }
  return `${base}?${params.toString()}`;
}

export function buildPictureSources(src: string): PictureSources {
  const entry = getManifestEntry(src);

  if (entry) {
    const bestFallback = largestVariant(entry.fallback);
    return {
      avifSrcSet: buildSrcSetFromVariants(entry.avif),
      webpSrcSet: buildSrcSetFromVariants(entry.webp),
      fallbackSrc: bestFallback?.path ?? src,
      fallbackSrcSet: buildSrcSetFromVariants(entry.fallback),
      intrinsicWidth: entry.width,
      intrinsicHeight: entry.height,
    };
  }

  if (isRemoteImage(src)) {
    return {
      fallbackSrc: defaultRemoteSrc(src),
      fallbackSrcSet: buildRemoteSrcSet(src),
    };
  }

  return { fallbackSrc: src };
}

/** @deprecated Use buildPictureSources instead. */
export function buildSrcSet(src: string): string | undefined {
  const picture = buildPictureSources(src);
  return picture.fallbackSrcSet ?? buildRemoteSrcSet(src);
}

/** @deprecated Use buildPictureSources instead. */
export function defaultResponsiveSrc(src: string): string {
  return buildPictureSources(src).fallbackSrc;
}
