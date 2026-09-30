"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { query, queryWithPool } from "@/lib/db";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { sectionConfigs } from "@/lib/admin-config";
import { slugify } from "@/lib/utils";
import { COOKIE_NAME } from "@/lib/local-auth";

// ─────────────────────────────────────────────────────────────────────────────
// Revalidate every public-facing route so admin changes appear immediately.
// ─────────────────────────────────────────────────────────────────────────────
function revalidateAllPublicPaths() {
  const publicPaths = [
    "/",
    "/about",
    "/experience",
    "/education",
    "/skills",
    "/projects",
    "/publications",
    "/certifications",
    "/awards",
    "/services",
    "/contact",
  ];
  for (const p of publicPaths) {
    revalidatePath(p);
  }
  revalidatePath("/", "layout");
}

// ─────────────────────────────────────────────────────────────────────────────
// String / value helpers
// ─────────────────────────────────────────────────────────────────────────────

function cleanString(value: FormDataEntryValue | null, max = 10000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function listValue(value: FormDataEntryValue | null): string[] {
  return cleanString(value)
    .split(/[\n,]+/)
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 100);
}

function nullable(value: string): string | null {
  return value || null;
}

function validUrl(value: string): string | null {
  if (!value) return null;
  return z.string().url().max(2000).parse(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic parameterised INSERT / UPDATE
// ─────────────────────────────────────────────────────────────────────────────

async function dbInsert(table: string, payload: Record<string, unknown>): Promise<string> {
  const keys   = Object.keys(payload);
  const values = Object.values(payload);
  const cols   = keys.map((k) => `"${k}"`).join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");
  const sql  = `INSERT INTO "${table}" (${cols}) VALUES (${placeholders}) RETURNING id`;
  const rows = await query(sql, values);
  return (rows[0] as any).id as string;
}

async function dbUpdate(
  table: string,
  id: string,
  payload: Record<string, unknown>
): Promise<void> {
  const keys   = Object.keys(payload);
  const values = Object.values(payload);
  const sets   = keys.map((k, i) => `"${k}" = $${i + 1}`).join(", ");
  const sql    = `UPDATE "${table}" SET ${sets}, updated_at = now() WHERE id = $${keys.length + 1}`;
  await query(sql, [...values, id]);
}

// ─────────────────────────────────────────────────────────────────────────────
// saveRecord — generic upsert for all admin sections
// ─────────────────────────────────────────────────────────────────────────────

export async function saveRecord(section: string, formData: FormData) {
  await requireAdmin();

  const config = sectionConfigs[section];
  if (!config) throw new Error("Invalid admin section.");

  const id      = cleanString(formData.get("id"), 80);
  const payload: Record<string, unknown> = {};

  for (const field of config.fields) {
    if (
      ["file", "multiple-files"].includes(field.type) ||
      ["remove_profile_image", "remove_resume"].includes(field.name)
    ) continue;

    const raw = formData.get(field.name);

    if (field.type === "checkbox") {
      payload[field.name] = raw === "on";
    } else if (field.type === "array") {
      payload[field.name] = listValue(raw);
    } else if (field.type === "number") {
      const v = cleanString(raw, 30);
      const n = v ? Number(v) : null;
      if (n !== null && !Number.isFinite(n))
        throw new Error(`${field.label} must be a valid number.`);
      payload[field.name] = n;
    } else if (field.type === "url") {
      payload[field.name] = validUrl(cleanString(raw, 2000));
    } else if (field.type === "email") {
      const v = cleanString(raw, 200);
      if (field.required && !v) throw new Error(`${field.label} is required.`);
      payload[field.name] = v ? z.string().email().max(200).parse(v) : null;
    } else if (field.type === "date") {
      const v = cleanString(raw, 20);
      if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v))
        throw new Error(`${field.label} must be a valid date.`);
      payload[field.name] = nullable(v);
    } else {
      const value = cleanString(raw);
      if (field.required && value.length < 1)
        throw new Error(`${field.label} is required.`);
      payload[field.name] = nullable(value);
    }
  }

  if (section === "projects") {
    const title = String(payload.title || "");
    payload.slug = slugify(String(payload.slug || "") || title);
    if (!payload.slug) throw new Error("A valid project slug is required.");
  }

  let recordId = id;

  if (id) {
    await dbUpdate(config.table, id, payload);
  } else if (config.singleton) {
    const existing = await query(`SELECT id FROM "${config.table}" LIMIT 1`, []);
    if (existing.length > 0) {
      const existingId = (existing[0] as any).id as string;
      await dbUpdate(config.table, existingId, payload);
      recordId = existingId;
    } else {
      recordId = await dbInsert(config.table, payload);
    }
  } else {
    if (config.orderable) {
      const maxRow = await query(
        `SELECT MAX(display_order) AS max_order FROM "${config.table}"`,
        []
      );
      payload.display_order = Number((maxRow[0] as any).max_order || 0) + 1;
    }
    recordId = await dbInsert(config.table, payload);
  }

  void recordId;
  revalidatePath(`/admin/${section}`);
  revalidateAllPublicPaths();
  redirect(`/admin/${section}?saved=1`);
}

// ─────────────────────────────────────────────────────────────────────────────
// deleteRecord
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteRecord(
  section: string,
  id: string,
  _formData?: FormData
) {
  await requireAdmin();
  const config = sectionConfigs[section];
  if (!config || config.singleton) throw new Error("This record cannot be deleted here.");

  if (section === "projects") {
    await query(`DELETE FROM project_images WHERE project_id = $1`, [id]);
  }
  await query(`DELETE FROM "${config.table}" WHERE id = $1`, [id]);
  revalidatePath(`/admin/${section}`);
  revalidateAllPublicPaths();
}

// ─────────────────────────────────────────────────────────────────────────────
// moveRecord — swaps display_order in a single atomic transaction
// ─────────────────────────────────────────────────────────────────────────────

export async function moveRecord(
  section: string,
  id: string,
  direction: "up" | "down",
  _formData?: FormData
) {
  await requireAdmin();
  const config = sectionConfigs[section];
  if (!config?.orderable) throw new Error("Section is not orderable.");

  const currentRows = await query(
    `SELECT id, display_order FROM "${config.table}" WHERE id = $1`,
    [id]
  );
  if (!currentRows.length) return;
  const current = currentRows[0] as { id: string; display_order: number };

  const neighborRows =
    direction === "up"
      ? await query(
          `SELECT id, display_order FROM "${config.table}"
           WHERE display_order < $1 ORDER BY display_order DESC LIMIT 1`,
          [current.display_order]
        )
      : await query(
          `SELECT id, display_order FROM "${config.table}"
           WHERE display_order > $1 ORDER BY display_order ASC LIMIT 1`,
          [current.display_order]
        );

  if (!neighborRows.length) return;
  const neighbor = neighborRows[0] as { id: string; display_order: number };

  // ── Atomic swap in a single transaction ───────────────────────────────────
  await queryWithPool(async (client) => {
    await client.query("BEGIN");
    try {
      await client.query(
        `UPDATE "${config.table}" SET display_order = $1, updated_at = now() WHERE id = $2`,
        [neighbor.display_order, current.id]
      );
      await client.query(
        `UPDATE "${config.table}" SET display_order = $1, updated_at = now() WHERE id = $2`,
        [current.display_order, neighbor.id]
      );
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }
  });

  revalidatePath(`/admin/${section}`);
  revalidateAllPublicPaths();
}

// ─────────────────────────────────────────────────────────────────────────────
// logoutAction
// ─────────────────────────────────────────────────────────────────────────────

export async function logoutAction(_formData?: FormData) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  redirect("/admin/login");
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact message actions
// ─────────────────────────────────────────────────────────────────────────────

export async function setMessageStatus(
  id: string,
  status: "read" | "unread",
  _formData?: FormData
) {
  await requireAdmin();
  await query(
    `UPDATE contact_messages SET status = $1, updated_at = now() WHERE id = $2`,
    [status, id]
  );
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string, _formData?: FormData) {
  await requireAdmin();
  await query(`DELETE FROM contact_messages WHERE id = $1`, [id]);
  revalidatePath("/admin/messages");
}

// ─────────────────────────────────────────────────────────────────────────────
// Project image actions
// ─────────────────────────────────────────────────────────────────────────────

export async function deleteProjectImage(id: string, _formData?: FormData) {
  await requireAdmin();
  await query(`DELETE FROM project_images WHERE id = $1`, [id]);
  revalidatePath("/admin/projects");
  revalidateAllPublicPaths();
}

export async function addProjectImageUrl(
  projectId: string,
  imageUrl: string,
  _formData?: FormData
) {
  await requireAdmin();
  if (!imageUrl) throw new Error("Image URL is required.");
  await query(
    `INSERT INTO project_images (project_id, image_url, display_order, is_public)
     VALUES ($1, $2, 0, true)`,
    [projectId, imageUrl]
  );
  revalidatePath("/admin/projects");
  revalidateAllPublicPaths();
}

// ─────────────────────────────────────────────────────────────────────────────
// Media actions (URL-based)
// ─────────────────────────────────────────────────────────────────────────────

export async function addMediaUrl(formData: FormData) {
  await requireAdmin();
  const url      = cleanString(formData.get("url"), 2000);
  const fileName = cleanString(formData.get("file_name"), 255) || "media";
  const bucket   = cleanString(formData.get("bucket"), 40) || "external";
  if (!url) throw new Error("URL is required.");
  await query(
    `INSERT INTO media (bucket, file_name, url, is_public) VALUES ($1, $2, $3, true)`,
    [bucket, fileName, url]
  );
  revalidatePath("/admin/media");
}

export async function deleteMedia(id: string, _formData?: FormData) {
  await requireAdmin();
  await query(`DELETE FROM media WHERE id = $1`, [id]);
  revalidatePath("/admin/media");
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Info singleton action
// No DDL is run here — the contact_info table is created by the schema script.
// ─────────────────────────────────────────────────────────────────────────────

export async function saveContactInfo(formData: FormData) {
  await requireAdmin();

  const phone         = cleanString(formData.get("phone"), 60) || null;
  const address       = cleanString(formData.get("address"), 500) || null;
  const businessHours = cleanString(formData.get("business_hours"), 500) || null;
  const isPublic      = formData.get("is_public") === "on";

  const rawEmail = cleanString(formData.get("email"), 200);
  let email: string | null = null;
  if (rawEmail) {
    email = z.string().email().max(200).parse(rawEmail);
  }

  const socialRaw    = cleanString(formData.get("social_links_text"), 5000);
  const social_links = socialRaw
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const sep      = line.indexOf("|");
      if (sep === -1) return null;
      const platform = line.slice(0, sep).trim();
      const url      = line.slice(sep + 1).trim();
      if (!platform || !url) return null;
      try {
        z.string().url().parse(url);
        return { platform, url };
      } catch {
        return null;
      }
    })
    .filter((x): x is { platform: string; url: string } => x !== null)
    .slice(0, 20);

  const existing = await query(`SELECT id FROM contact_info LIMIT 1`, []);

  if (existing.length > 0) {
    const id = (existing[0] as any).id as string;
    await query(
      `UPDATE contact_info
       SET phone = $1, email = $2, address = $3,
           business_hours = $4, social_links = $5::jsonb,
           is_public = $6, updated_at = now()
       WHERE id = $7`,
      [phone, email, address, businessHours, JSON.stringify(social_links), isPublic, id]
    );
  } else {
    await query(
      `INSERT INTO contact_info (phone, email, address, business_hours, social_links, is_public)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [phone, email, address, businessHours, JSON.stringify(social_links), isPublic]
    );
  }

  revalidatePath("/admin/contact-info");
  revalidatePath("/contact");
  revalidateAllPublicPaths();
  redirect("/admin/contact-info?saved=1");
}
