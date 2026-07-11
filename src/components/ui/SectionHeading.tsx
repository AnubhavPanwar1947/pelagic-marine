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
      {eyebrow && <p className="type-eyebrow">{eyebrow}</p>}
      <h2 className="type-display mt-4 text-3xl leading-[1.08] text-pelagic-ink sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={`type-lead mt-5 max-w-3xl ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
