import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition } from "@/lib/site-images";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Maritime hero photo — light scrim keeps text readable (peer-style) */
  /** Tighter hero for short copy (e.g. /news) — no min-height, reduced padding */
  compact?: boolean;
};

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden border-b border-pelagic-sand ${compact ? "" : "min-h-[17rem] sm:min-h-[19rem]"}`}
    >
      {imageSrc ? (
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="hero-ken-burns absolute inset-0">
            <SiteImage
              src={imageSrc}
              alt=""
              fill
              priority
              objectPosition={getImageObjectPosition(imageSrc)}
              className="scale-110 object-cover"
              sizes={imageSizes.pageHero}
            />
          </div>
          <div className="page-hero-scrim absolute inset-0" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#e8f3fb] via-white to-[#f3f9fb]" />
      )}
      <div
        className={`relative mx-auto min-w-0 max-w-7xl px-4 sm:px-6 lg:px-8 ${
          compact
            ? "pt-[clamp(4.5rem,3.25rem+2.5vw,5.5rem)] pb-[clamp(1.25rem,0.875rem+1vw,2rem)]"
            : "page-hero-py"
        }`}
      >
        {eyebrow ? <p className="type-eyebrow">{eyebrow}</p> : null}
        <h1
          className={`type-display type-page-title max-w-4xl min-w-0 break-words text-pelagic-ink ${eyebrow ? "mt-4" : ""}`}
        >
          {title}
        </h1>
        {description && (
          <p className="type-lead mt-5 max-w-2xl min-w-0 break-words">{description}</p>
        )}
      </div>
    </section>
  );
}
