/**
 * GET  /api/contact-info  — public, returns the singleton contact_info row
 * PUT  /api/contact-info  — admin only, upserts the singleton row
 */
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { z } from "zod";

export const runtime = "nodejs";

// ── Zod schema for PUT body ──────────────────────────────────────────────────
const SocialLinkSchema = z.object({
  platform: z.string().max(80),
  url: z.string().url().max(2000),
});

const ContactInfoSchema = z.object({
  phone:          z.string().max(60).nullable().optional(),
  email:          z.union([z.string().email().max(200), z.literal(""), z.null()]).optional(),
  address:        z.string().max(500).nullable().optional(),
  business_hours: z.string().max(500).nullable().optional(),
  social_links:   z.array(SocialLinkSchema).max(20).optional(),
});

// ── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    // Auto-create table if migration hasn't been run yet
    await query(
      `CREATE TABLE IF NOT EXISTS contact_info (
        id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        phone          text,
        email          text,
        address        text,
        business_hours text,
        social_links   jsonb NOT NULL DEFAULT '[]',
        is_public      boolean NOT NULL DEFAULT true,
        created_at     timestamptz NOT NULL DEFAULT now(),
        updated_at     timestamptz NOT NULL DEFAULT now()
      )`,
      []
    ).catch(() => {});

    const rows = await query(`SELECT * FROM contact_info LIMIT 1`, []);
    const row = rows[0] ?? null;
    if (!row) {
      return NextResponse.json({
        phone: null, email: null, address: null,
        business_hours: null, social_links: [],
      });
    }
    // social_links is stored as JSONB; Neon returns it already parsed
    const social_links = Array.isArray(row.social_links) ? row.social_links : [];
    return NextResponse.json({ ...row, social_links });
  } catch (err) {
    console.error("[GET /api/contact-info]", err);
    return NextResponse.json({ error: "Failed to fetch contact info." }, { status: 500 });
  }
}

// ── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(request: Request) {
  // Admin-only
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = ContactInfoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const {
    phone          = null,
    email          = null,
    address        = null,
    business_hours = null,
    social_links   = [],
  } = parsed.data;

  const socialJson = JSON.stringify(social_links);

  try {
    // Check if a row already exists
    const existing = await query(`SELECT id FROM contact_info LIMIT 1`, []);

    if (existing.length > 0) {
      const id = (existing[0] as any).id;
      await query(
        `UPDATE contact_info
         SET phone = $1, email = $2, address = $3,
             business_hours = $4, social_links = $5::jsonb,
             updated_at = now()
         WHERE id = $6`,
        [
          phone   || null,
          email   || null,
          address || null,
          business_hours || null,
          socialJson,
          id,
        ]
      );
    } else {
      await query(
        `INSERT INTO contact_info (phone, email, address, business_hours, social_links)
         VALUES ($1, $2, $3, $4, $5::jsonb)`,
        [
          phone   || null,
          email   || null,
          address || null,
          business_hours || null,
          socialJson,
        ]
      );
    }

    const updated = await query(`SELECT * FROM contact_info LIMIT 1`, []);
    const row = updated[0] as any;
    return NextResponse.json({
      ...row,
      social_links: Array.isArray(row.social_links) ? row.social_links : [],
    });
  } catch (err) {
    console.error("[PUT /api/contact-info]", err);
    return NextResponse.json({ error: "Failed to save contact info." }, { status: 500 });
  }
}
