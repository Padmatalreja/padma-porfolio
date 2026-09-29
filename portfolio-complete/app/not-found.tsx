import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main
      className="relative grid min-h-screen place-items-center overflow-hidden px-5"
      style={{ background: "var(--bg-base)" }}
    >
      {/* Background glow */}
      <div
        className="glow-orb pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      <div className="relative z-10 text-center">
        <p
          className="gradient-text font-black leading-none tracking-tight"
          style={{ fontSize: "clamp(5rem, 20vw, 10rem)" }}
        >
          404
        </p>

        <h1 className="mt-4 text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          Page not found
        </h1>
        <p
          className="mt-3 max-w-sm mx-auto text-lg"
          style={{ color: "var(--text-secondary)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <ArrowLeft size={16} />
            Return home
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}
