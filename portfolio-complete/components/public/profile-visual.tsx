import Image from "next/image";

interface Props {
  name: string;
  src?: string | null;
  size?: "md" | "lg";
  /** Set true only when this is the LCP element (hero above the fold). Default false. */
  priority?: boolean;
}

export function ProfileVisual({ name, src, size = "md", priority = false }: Props) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 3)
    .join("");

  // Container is always the same fixed shape — image fills it via object-cover.
  // Width adapts responsively; height is locked by aspect-ratio so the card
  // never resizes based on what image is uploaded.
  const maxW = size === "lg" ? "max-w-sm" : "max-w-[340px]";
  const isLocalUpload = src?.startsWith("/uploads/");

  return (
    <div className={`relative w-full ${maxW} mx-auto`}>

      {/* ── Decorative background card (behind and offset) ── */}
      <div
        className="absolute rounded-2xl"
        style={{
          inset:      "12px -10px -10px 10px",
          background: "var(--bg-elevated)",
          border:     "1.5px solid rgba(201,168,118,0.3)",
          zIndex:     0,
        }}
        aria-hidden="true"
      />

      {/* ── Warm glow wash ── */}
      <div
        className="absolute rounded-2xl pointer-events-none"
        style={{
          inset:      0,
          background: "radial-gradient(circle at 60% 40%, rgba(201,168,118,0.28) 0%, transparent 70%)",
          filter:     "blur(32px)",
          transform:  "scale(1.1)",
          zIndex:     0,
        }}
        aria-hidden="true"
      />

      {/* ── Main image container ──
          Fixed 4:5 portrait ratio — works for portrait, square, and landscape.
          object-cover + center-top keeps the subject visible for most images.
          overflow-hidden + rounded-2xl ensures nothing bleeds outside.       */}
      <div
        className="relative z-10 w-full overflow-hidden rounded-2xl"
        style={{
          aspectRatio: "4 / 5",
          border:      "1.5px solid rgba(201,168,118,0.45)",
          boxShadow:   "0 8px 40px rgba(74,55,40,0.14), 0 2px 8px rgba(74,55,40,0.08)",
          background:  "var(--bg-card)",
        }}
      >
        {src ? (
          <Image
            src={src}
            alt={`${name} profile photo`}
            fill
            priority
            unoptimized={isLocalUpload}
            sizes="(max-width:480px) 90vw, (max-width:1024px) 50vw, 340px"
            style={{
              objectFit:      "cover",
              // center-top: face/subject is usually upper-center;
              // avoids showing only background for landscape images
              objectPosition: "center top",
            }}
          />
        ) : (
          /* Fallback — warm serif initials */
          <div
            className="flex h-full w-full items-center justify-center"
            aria-label={`${name} initials`}
            style={{
              background: "linear-gradient(135deg, rgba(201,168,118,0.15) 0%, rgba(107,78,55,0.06) 100%)",
            }}
          >
            <span
              style={{
                fontFamily:    "var(--font-display)",
                fontSize:      "5rem",
                fontWeight:    700,
                color:         "var(--tan)",
                letterSpacing: "-0.02em",
                lineHeight:    1,
                fontStyle:     "italic",
              }}
            >
              {initials}
            </span>
          </div>
        )}

        {/* Subtle warm vignette — editorial portrait finish */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 55%, rgba(232,220,200,0.18) 100%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Tan border ring overlay ── */}
      <div
        className="absolute inset-0 z-10 rounded-2xl pointer-events-none"
        style={{
          padding:             "1.5px",
          background:          "linear-gradient(135deg, rgba(201,168,118,0.55) 0%, rgba(107,78,55,0.15) 100%)",
          WebkitMask:          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite:       "exclude",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
