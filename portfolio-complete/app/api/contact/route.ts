import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { query } from "@/lib/db";
import { contactSchema } from "@/lib/validations/contact";
import { hasNeonEnv } from "@/lib/env";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!hasNeonEnv()) {
      return NextResponse.json(
        { message: "Contact storage is not configured yet." },
        { status: 503 }
      );
    }

    const json   = await request.json();
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Please provide valid contact information." },
        { status: 400 }
      );
    }

    // Honeypot — silent discard
    if (parsed.data.website) {
      return NextResponse.json({ message: "Message received." });
    }

    // ── IP hash ────────────────────────────────────────────────────────────
    // Only trust x-forwarded-for when running behind a known reverse proxy.
    // We take the first IP in the chain and hash it with a salt so the raw
    // address is never stored.
    const forwarded =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const salt   = process.env.CONTACT_RATE_LIMIT_SALT || "portfolio-contact";
    const ipHash = createHash("sha256")
      .update(`${salt}:${forwarded}`)
      .digest("hex");

    // ── Rate-limiting — atomic upsert prevents race conditions ────────────
    // Uses INSERT ... ON CONFLICT to atomically create or update the rate
    // limit record. Two simultaneous first-time requests from the same IP
    // both hit the INSERT; one wins and the other updates — no lost increment.
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // First, reset expired windows atomically
    await query(
      `UPDATE contact_rate_limits
       SET window_started_at = now(), request_count = 0, updated_at = now()
       WHERE ip_hash = $1 AND window_started_at < $2`,
      [ipHash, hourAgo]
    );

    // Atomic upsert: insert with count=1 or increment if already exists
    const result = await query(
      `INSERT INTO contact_rate_limits (ip_hash, window_started_at, request_count)
       VALUES ($1, now(), 1)
       ON CONFLICT (ip_hash) DO UPDATE
         SET request_count = contact_rate_limits.request_count + 1,
             updated_at    = now()
       RETURNING request_count`,
      [ipHash]
    );

    const requestCount = Number((result[0] as any)?.request_count ?? 1);
    if (requestCount > 5) {
      return NextResponse.json(
        { message: "Too many messages were sent recently. Please try again later." },
        { status: 429 }
      );
    }

    // ── Insert message ─────────────────────────────────────────────────────
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;
    await query(
      `INSERT INTO contact_messages (name, email, subject, message, user_agent)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        parsed.data.name.slice(0, 100),
        parsed.data.email.slice(0, 200),
        parsed.data.subject.slice(0, 160),
        parsed.data.message.slice(0, 5000),
        userAgent,
      ]
    );

    return NextResponse.json({ message: "Thanks — your message was sent successfully." });
  } catch {
    return NextResponse.json(
      { message: "Unable to send your message." },
      { status: 500 }
    );
  }
}
