/**
 * POST /api/upload
 *
 * Accepts a multipart form with a single `file` field and an optional `folder` field.
 * Stores the file as a base64 data-URL in the Neon `media` table and returns { url }.
 *
 * Why data-URLs instead of local filesystem?
 *   Vercel's serverless environment has an ephemeral, read-only filesystem —
 *   files written to disk during one request are gone by the next cold start.
 *   Storing the file directly in Neon means it persists alongside the rest of
 *   your portfolio data with zero extra services or credentials.
 *
 * Size limits (enforced before storing):
 *   Images — 4 MB   (keeps data-URLs reasonable in the DB and on the wire)
 *   PDFs   — 8 MB
 *
 * Requires the admin session cookie — not publicly accessible.
 */
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;  // 4 MB
const MAX_PDF_BYTES   = 8 * 1024 * 1024;  // 8 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

export async function POST(request: Request) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // ── Parse form data ───────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart request." }, { status: 400 });
  }

  const file   = formData.get("file");
  const folder = String(formData.get("folder") || "portfolio").replace(/[^a-z0-9_-]/gi, "");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // ── Validate type ─────────────────────────────────────────────────────────
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, GIF, SVG, PDF.` },
      { status: 400 }
    );
  }

  // ── Validate size ─────────────────────────────────────────────────────────
  const isPdf    = file.type === "application/pdf";
  const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    const maxMb = maxBytes / (1024 * 1024);
    return NextResponse.json(
      { error: `File too large. Maximum size is ${maxMb} MB.` },
      { status: 413 }
    );
  }

  // ── Build a safe filename ─────────────────────────────────────────────────
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9._\- ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80) || "file";

  // Random 6-byte hex suffix to avoid collisions
  const nonce = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const fileName = `${baseName}_${nonce}.${ext}`;

  // ── Convert to base64 data-URL ────────────────────────────────────────────
  const arrayBuffer = await file.arrayBuffer();
  const base64      = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl     = `data:${file.type};base64,${base64}`;

  // ── Persist to Neon media table ───────────────────────────────────────────
  try {
    await query(
      `INSERT INTO media (bucket, file_name, url, mime_type, size_bytes, is_public)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [folder, fileName, dataUrl, file.type, file.size]
    );

    return NextResponse.json({ url: dataUrl });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    console.error("[/api/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
