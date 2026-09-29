"use client";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      className="grid min-h-screen place-items-center px-5"
      style={{ background: "var(--bg-base)" }}
    >
      <div className="text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
          }}
        >
          <span className="text-2xl">⚠</span>
        </div>
        <p className="eyebrow mb-3" style={{ color: "var(--magenta)" }}>
          Error
        </p>
        <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          Something went wrong
        </h1>
        <p className="mt-3 max-w-sm mx-auto" style={{ color: "var(--text-secondary)" }}>
          The page could not be loaded safely.
          {error.digest && (
            <span className="ml-2 text-xs" style={{ color: "var(--text-muted)" }}>
              ({error.digest})
            </span>
          )}
        </p>
        <div className="mt-8">
          <Button variant="gradient" onClick={reset}>
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
