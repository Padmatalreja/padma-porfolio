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

    const json = await request.json();
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

    const forwarded =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const salt = process.env.CONTACT_RATE_LIMIT_SALT || "portfolio-contact";
    const ipHash = createHash("sha256")
      .update(`${salt}:${forwarded}`)
      .digest("hex");

    // ── Rate-limiting ────────────────────────────────────────────────────────
    const existing = await query`
      SELECT request_count, window_started_at
      FROM contact_rate_limits
      WHERE ip_hash = ${ipHash}
      LIMIT 1
    `;

    if (existing.length === 0) {
      await query`
        INSERT INTO contact_rate_limits (ip_hash, window_started_at, request_count)
        VALUES (${ipHash}, now(), 1)
        ON CONFLICT (ip_hash) DO NOTHING
      `;
    } else {
      const row = existing[0];
      const windowStart = new Date(row.window_started_at as string);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);

      if (windowStart < hourAgo) {
        await query`
          UPDATE contact_rate_limits
          SET window_started_at = now(), request_count = 1, updated_at = now()
          WHERE ip_hash = ${ipHash}
        `;
      } else if ((row.request_count as number) >= 5) {
        return NextResponse.json(
          { message: "Too many messages were sent recently. Please try again later." },
          { status: 429 }
        );
      } else {
        await query`
          UPDATE contact_rate_limits
          SET request_count = request_count + 1, updated_at = now()
          WHERE ip_hash = ${ipHash}
        `;
      }
    }

    // ── Insert message ────────────────────────────────────────────────────────
    const userAgent = request.headers.get("user-agent")?.slice(0, 500) || null;
    await query`
      INSERT INTO contact_messages (name, email, subject, message, user_agent)
      VALUES (
        ${parsed.data.name.slice(0, 100)},
        ${parsed.data.email.slice(0, 200)},
        ${parsed.data.subject.slice(0, 160)},
        ${parsed.data.message.slice(0, 5000)},
        ${userAgent}
      )
    `;

    return NextResponse.json({ message: "Thanks — your message was sent successfully." });
  } catch {
    return NextResponse.json(
      { message: "Unable to send your message." },
      { status: 500 }
    );
  }
}
