import { SiteImage } from "@/components/ui/SiteImage";
import { imageSizes } from "@/lib/image-sizes";
import { getImageObjectPosition } from "@/lib/site-images";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  /** Maritime hero photo — light scrim keeps text readable (peer-style) */
  imageSrc?: string;
};

export function PageHero({ eyebrow, title, description, imageSrc }: PageHeroProps) {
  return (
    <section className="relative min-h-[17rem] overflow-hidden border-b border-pelagic-sand sm:min-h-[19rem]">
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
      <div className="relative mx-auto min-w-0 max-w-7xl px-4 page-hero-py sm:px-6 lg:px-8">
        <p className="type-eyebrow">{eyebrow}</p>
        <h1 className="type-display type-page-title mt-4 max-w-4xl min-w-0 break-words text-pelagic-ink">
          {title}
        </h1>
        {description && (
          <p className="type-lead mt-5 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}
