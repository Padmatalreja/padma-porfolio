export default function Loading() {
  return (
    <main
      className="mx-auto max-w-7xl px-5 py-20 lg:px-8"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="animate-pulse space-y-5">
        {/* Eyebrow */}
        <div
          className="h-3 w-24 rounded-full"
          style={{ background: "rgba(124,58,237,0.2)" }}
        />
        {/* Heading */}
        <div
          className="h-10 max-w-xl rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        {/* Subheading */}
        <div
          className="h-4 max-w-2xl rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="h-4 max-w-lg rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        {/* Card grid */}
        <div className="grid gap-5 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                opacity: 1 - (i - 1) * 0.15,
              }}
            />
          ))}
        </div>

        {/* Second row */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                opacity: 0.6 - (i - 1) * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
