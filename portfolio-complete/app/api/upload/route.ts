/**
 * POST /api/upload
 * Accepts a multipart form with a single `file` field.
 * Saves the file to /public/uploads/ and returns { url }.
 *
 * Files are stored locally. NOTE: local storage is not suitable for
 * serverless/Vercel deployments — migrate to Cloudinary or similar for
 * production. The CLOUDINARY_* env vars are stubbed in .env.example.
 *
 * Requires the admin session cookie — not publicly accessible.
 */
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getAdminUser } from "@/lib/auth";

export const runtime = "nodejs";

// Max file sizes
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;   // 6 MB
const MAX_PDF_BYTES   = 10 * 1024 * 1024;  // 10 MB

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

// Map MIME → file extension
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg":       "jpg",
  "image/png":        "png",
  "image/webp":       "webp",
  "image/avif":       "avif",
  "image/gif":        "gif",
  "image/svg+xml":    "svg",
  "application/pdf":  "pdf",
};

/** Generate a short random hex token */
function randomHex(bytes = 8): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  // ── Auth check — do NOT wrap in try/catch; only catch auth-specific errors ──
  // Using getAdminUser() (returns null instead of throwing) avoids silently
  // swallowing unrelated errors that would otherwise grant unauthorised access.
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart request." }, { status: 400 });
  }

  const file   = formData.get("file");
  // Sanitise the folder parameter to alphanumeric/dash/underscore only
  const folder = String(formData.get("folder") || "portfolio").replace(/[^a-z0-9_-]/gi, "");

  if (!(file instanceof File) || !file.size) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const isPdf   = file.type === "application/pdf";
  const isImage = ALLOWED_IMAGE_TYPES.has(file.type);

  if (!isPdf && !isImage) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, AVIF, GIF, SVG, PDF.` },
      { status: 400 }
    );
  }

  const maxBytes = isPdf ? MAX_PDF_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    const maxMb = maxBytes / (1024 * 1024);
    return NextResponse.json(
      { error: `File too large. Maximum size is ${maxMb} MB.` },
      { status: 413 }
    );
  }

  const ext      = MIME_TO_EXT[file.type] ?? "bin";
  const originalBase = file.name
    .replace(/\.[^.]+$/, "")                  // strip extension
    .replace(/[^a-zA-Z0-9._\- ]/g, "")        // remove unsafe chars
    .replace(/\s+/g, "_")                      // spaces → underscores
    .slice(0, 80)                              // max 80 chars
    || "file";
  const filename = `${originalBase}_${randomHex(6)}.${ext}`;

  // Resolve the destination directory inside /public/uploads/<folder>/
  const uploadDir = join(process.cwd(), "public", "uploads", folder);

  try {
    await mkdir(uploadDir, { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer      = Buffer.from(arrayBuffer);
    await writeFile(join(uploadDir, filename), buffer);

    // The public URL served by Next.js static file handler
    const url = `/uploads/${folder}/${filename}`;

    return NextResponse.json({ url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed.";
    console.error("[/api/upload]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
