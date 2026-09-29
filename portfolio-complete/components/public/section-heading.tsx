export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 max-w-3xl">
      {eyebrow && (
        <p className="eyebrow mb-3">{eyebrow}</p>
      )}
      <h1
        className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h1>
      {description && (
        <p
          className="mt-4 text-lg leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
