/**
 * GET /api/download-cv
 *
 * Streams the CV/resume file with a proper Content-Disposition header so the
 * browser saves it with a clean name (e.g. "Padma_Kumari_Talreja_CV.pdf")
 * regardless of what the file is stored as on disk.
 *
 * Query params:
 *   url  — the /uploads/... path stored in profile.resume_url
 *   name — desired download filename (optional, falls back to file basename)
 *
 * Security: resolves the final path and confirms it is strictly inside
 * /public/uploads/ to prevent path-traversal attacks.
 */
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname, resolve, sep } from "path";

export const runtime = "nodejs";

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9_\-. ]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 100)
    .trim() || "resume";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl  = searchParams.get("url");   // e.g. /uploads/portfolio/3a9a5c.pdf
  const rawName  = searchParams.get("name");  // e.g. "Padma Kumari Talreja"

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing url param." }, { status: 400 });
  }

  // Only allow serving files from /uploads/ to prevent path traversal
  if (!fileUrl.startsWith("/uploads/")) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  // ── Strict path-traversal guard ───────────────────────────────────────────
  // Resolve the absolute path and ensure it is inside the uploads directory.
  // path.join normalises ".." sequences, so we must verify AFTER resolution.
  const uploadsRoot = resolve(process.cwd(), "public", "uploads");
  // Strip the leading "/" and resolve relative to public/
  const filePath = resolve(process.cwd(), "public", fileUrl.replace(/^\//, ""));

  if (!filePath.startsWith(uploadsRoot + sep) && filePath !== uploadsRoot) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }
  // ─────────────────────────────────────────────────────────────────────────

  const ext = extname(filePath) || ".pdf";
  const baseName = rawName
    ? sanitizeFilename(rawName) + "_CV" + ext
    : sanitizeFilename(filePath.split(sep).pop() ?? "resume") + ext;

  try {
    const buffer = await readFile(filePath);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": ext === ".pdf" ? "application/pdf" : "application/octet-stream",
        "Content-Disposition": `attachment; filename="${baseName}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
}
