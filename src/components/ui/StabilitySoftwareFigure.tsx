import Link from "next/link";
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";
import {
  STABILITY_SOFTWARE_SCREENSHOT_ALT,
  siteImages,
} from "@/lib/site-images";

type StabilitySoftwareFigureProps = {
  className?: string;
  caption?: string;
};

/** UMISTAB / stability analysis screenshot — full frame, responsive from narrow viewports up. */
export function StabilitySoftwareFigure({
  className = "",
  caption = "Example output from stability and longitudinal strength analysis — validation, shear force and bending moment plots, and vessel arrangement.",
}: StabilitySoftwareFigureProps) {
  const src = siteImages.engineering.stabilitySoftware;

  return (
    <figure
      className={`min-w-0 overflow-hidden rounded-2xl border border-pelagic-sand bg-white shadow-sm ${className}`}
    >
      <Link
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="block min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pelagic-accent"
        title="Open full-size stability software screenshot"
      >
        <ResponsiveImage
          src={src}
          alt={STABILITY_SOFTWARE_SCREENSHOT_ALT}
          className="block h-auto w-full max-w-full object-contain"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 48rem"
          style={{ aspectRatio: "1024 / 551" }}
        />
      </Link>
      {caption ? (
        <figcaption className="border-t border-pelagic-sand/80 px-4 py-3 text-xs leading-relaxed text-pelagic-steel">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
