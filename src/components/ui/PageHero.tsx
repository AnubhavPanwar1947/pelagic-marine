import { SiteImage } from "@/components/ui/SiteImage";

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
        <div className="absolute inset-0" aria-hidden>
          <SiteImage
            src={imageSrc}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="page-hero-scrim absolute inset-0" />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-pelagic-sky/70 via-white to-pelagic-mist/50" />
          <div className="absolute inset-0 bg-maritime-grid opacity-40" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <p className="type-eyebrow">{eyebrow}</p>
        <h1 className="type-display mt-4 max-w-4xl text-3xl leading-[1.08] text-pelagic-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="type-lead mt-5 max-w-2xl">{description}</p>
        )}
      </div>
    </section>
  );
}
