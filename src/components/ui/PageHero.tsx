type PageHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-pelagic-sand bg-pelagic-sand py-16 sm:py-20">
      <div className="absolute inset-0 bg-maritime-grid opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-base font-bold uppercase tracking-[0.22em] text-pelagic-gold sm:text-lg md:text-xl">
          {eyebrow}
        </p>
        <h1 className="font-display mt-3 max-w-4xl text-3xl font-bold leading-tight text-pelagic-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-pelagic-steel">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
