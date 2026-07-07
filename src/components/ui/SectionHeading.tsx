type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-4xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p className="text-base font-bold uppercase tracking-[0.22em] text-pelagic-gold sm:text-lg md:text-xl">
          {eyebrow}
        </p>
      )}
      <h2 className="font-display mt-3 text-4xl font-bold leading-[1.06] tracking-tight text-pelagic-ink sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-pelagic-steel sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
