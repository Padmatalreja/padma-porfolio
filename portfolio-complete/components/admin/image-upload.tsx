"use client";
/**
 * ImageUpload
 * ──────────────────────────────────────────────────────────────────────
 * Drag-and-drop / click-to-browse file uploader for the admin panel.
 * Uploads to /api/upload which saves files locally in /public/uploads/.
 * Stores the returned URL in a hidden <input> so the parent server-action
 * form picks it up on save.
 *
 * Users can also paste a URL directly if they prefer to use a remote URL.
 */
import { useCallback, useRef, useState } from "react";
import { Upload, Link2, X, Loader2, FileText, ImageIcon } from "lucide-react";

interface Props {
  name: string;
  defaultUrl?: string;
  accept?: string;
  isPdf?: boolean;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading"; progress: number }
  | { status: "done"; url: string }
  | { status: "error"; message: string };

export function ImageUpload({ name, defaultUrl = "", accept = "image/*", isPdf = false }: Props) {
  const [url, setUrl] = useState(defaultUrl);
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteValue, setPasteValue] = useState(defaultUrl);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const doUpload = useCallback(async (file: File) => {
    setUpload({ status: "uploading", progress: 0 });
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "portfolio");

    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Upload failed (${res.status})`);
      setUrl(json.url);
      setPasteValue(json.url);
      setUpload({ status: "done", url: json.url });
    } catch (err: unknown) {
      setUpload({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      doUpload(files[0]);
    },
    [doUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const applyPastedUrl = () => {
    const trimmed = pasteValue.trim();
    setUrl(trimmed);
    setPasteMode(false);
    setUpload({ status: "idle" });
  };

  const clearFile = () => {
    setUrl("");
    setPasteValue("");
    setUpload({ status: "idle" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isLoading = upload.status === "uploading";

  // ── Shared border style ──────────────────────────────────────────────
  const boxStyle: React.CSSProperties = {
    background: dragOver ? "rgba(201,168,118,0.08)" : "var(--bg-elevated)",
    border: `1.5px dashed ${dragOver ? "rgba(201,168,118,0.6)" : "var(--border)"}`,
    borderRadius: "0.75rem",
    transition: "all 0.15s",
  };

  return (
    <div className="space-y-2">
      {/* Hidden value input — read by the server action */}
      <input type="hidden" name={name} value={url} />

      {/* ── Preview ── */}
      {url && !pasteMode && (
        <div
          className="group relative flex items-center gap-3 rounded-xl p-3"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
          }}
        >
          {isPdf ? (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
              style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)" }}
            >
              <FileText size={20} style={{ color: "var(--cyan)" }} />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt="Preview"
              className="h-12 w-12 shrink-0 rounded-lg object-cover"
              style={{ border: "1px solid var(--border)" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-xs font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {url.split("/").pop() || url}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs transition-colors"
              style={{ color: "var(--cyan)" }}
            >
              View ↗
            </a>
          </div>
          <button
            type="button"
            onClick={clearFile}
            title="Remove"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg opacity-60 transition-opacity hover:opacity-100"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* ── Drop zone ── */}
      {!url && !pasteMode && (
        <div
          style={boxStyle}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-2 px-4 py-8 text-center"
        >
          {isLoading ? (
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--tan)" }} />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: "rgba(201,168,118,0.12)", border: "1px solid rgba(201,168,118,0.25)" }}
            >
              {isPdf
                ? <FileText size={18} style={{ color: "var(--tan-dark)" }} />
                : <ImageIcon size={18} style={{ color: "var(--tan-dark)" }} />
              }
            </div>
          )}
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {isLoading ? "Uploading…" : "Drop file here or click to browse"}
            </p>
            <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
              {isPdf ? "PDF, max 10 MB" : "JPEG, PNG, WebP, AVIF, max 6 MB"}
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}

      {/* ── Upload error ── */}
      {upload.status === "error" && (
        <p
          className="rounded-lg px-3 py-2 text-xs font-semibold"
          style={{
            background: "var(--error-bg)",
            border: "1px solid var(--error-border)",
            color: "var(--error)",
          }}
        >
          {upload.message}
        </p>
      )}

      {/* ── URL paste mode ── */}
      {pasteMode ? (
        <div className="flex gap-2">
          <input
            autoFocus
            value={pasteValue}
            onChange={(e) => setPasteValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); applyPastedUrl(); }
              if (e.key === "Escape") setPasteMode(false);
            }}
            placeholder="https://..."
            className="flex-1 rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--tan)",
              color: "var(--text-primary)",
              boxShadow: "0 0 0 3px rgba(201,168,118,0.18)",
            }}
          />
          <button
            type="button"
            onClick={applyPastedUrl}
            className="rounded-xl px-3 py-2 text-xs font-semibold text-white"
            style={{ background: "var(--gradient-brand)" }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setPasteMode(false)}
            className="rounded-xl px-3 py-2 text-xs font-semibold"
            style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </div>
      ) : (
        /* ── Action row ── */
        <div className="flex flex-wrap gap-2">
          {!url && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
              style={{
                background: "rgba(201,168,118,0.1)",
                border: "1px solid rgba(201,168,118,0.28)",
                color: "var(--tan-dark)",
              }}
            >
              <Upload size={13} />
              Upload file
            </button>
          )}
          <button
            type="button"
            onClick={() => { setPasteMode(true); setPasteValue(url); }}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            <Link2 size={13} />
            {url ? "Change URL" : "Paste URL"}
          </button>
          {url && (
            <button
              type="button"
              onClick={() => { clearFile(); fileInputRef.current?.click(); }}
              className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all"
              style={{
                background: "rgba(201,168,118,0.1)",
                border: "1px solid rgba(201,168,118,0.28)",
                color: "var(--tan-dark)",
              }}
            >
              <Upload size={13} />
              Replace file
            </button>
          )}
          {/* Hidden file input always available */}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      )}
    </div>
  );
}
