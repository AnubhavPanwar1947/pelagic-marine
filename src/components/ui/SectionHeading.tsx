type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  /** Highlighted trailing phrase — ShoreSafe-style accent color on key words */
  titleAccent?: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-4xl min-w-0 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <p className="type-eyebrow">{eyebrow}</p>}
      <h2 className="type-display type-section-title mt-4 min-w-0 break-words text-pelagic-ink">
        {title}
        {titleAccent ? (
          <>
            {" "}
            <span className="text-heading-accent">{titleAccent}</span>
          </>
        ) : null}
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
