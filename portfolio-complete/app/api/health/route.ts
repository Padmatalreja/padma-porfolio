/**
 * GET /api/health
 *
 * Lightweight liveness + readiness probe.
 * Returns 200 with a JSON payload when the app is running and the database
 * is reachable.  Returns 503 when the database check fails so load-balancers
 * and deployment pipelines can detect broken deployments.
 */
import { NextResponse } from "next/server";
import { hasNeonEnv } from "@/lib/env";
import { query } from "@/lib/db";

export const runtime = "nodejs";
// Never cache the health endpoint
export const revalidate = 0;

export async function GET() {
  const start = Date.now();

  // ── Database check ────────────────────────────────────────────────────────
  let dbStatus: "ok" | "unconfigured" | "error" = "unconfigured";
  let dbError: string | undefined;

  if (hasNeonEnv()) {
    try {
      await query("SELECT 1 AS ping", []);
      dbStatus = "ok";
    } catch (err) {
      dbStatus = "error";
      dbError  = err instanceof Error ? err.message : "unknown error";
      console.error("[/api/health] Database check failed:", dbError);
    }
  }

  const healthy = dbStatus === "ok" || dbStatus === "unconfigured";
  const latency = Date.now() - start;

  return NextResponse.json(
    {
      status:   healthy ? "ok" : "degraded",
      database: dbStatus,
      ...(dbError ? { database_error: dbError } : {}),
      latency_ms: latency,
      timestamp:  new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 }
  );
}
