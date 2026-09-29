import Link from "next/link";
import { LockKeyhole, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginAction } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main
      className="flex min-h-screen items-center justify-center px-5"
      style={{
        background: "var(--bg-base)",
        backgroundImage:
          "radial-gradient(ellipse at 60% 20%, rgba(201,168,118,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(168,136,79,0.07) 0%, transparent 50%)",
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-card-lg)",
        }}
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-brand)", boxShadow: "var(--shadow-btn-lg)" }}
          >
            <LockKeyhole size={28} color="#fff" />
          </div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>
            Admin <span className="gradient-text">Login</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            Secure access to portfolio admin panel
          </p>
        </div>

        {/* Error */}
        {sp.error && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl p-4 text-sm"
            style={{
              background: "var(--error-bg)",
              border: "1px solid var(--error-border)",
              color: "var(--error)",
            }}
          >
            ⚠ {sp.error}
          </div>
        )}

        {/* Form */}
        <form action={loginAction} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" variant="gradient" className="mt-2 w-full justify-center">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="footer-link inline-flex items-center gap-1.5 text-sm">
            <ArrowLeft size={14} />
            Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
