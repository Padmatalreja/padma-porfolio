import { Trash2, Image as ImageIcon, FileText, Link2 } from "lucide-react";
import { query } from "@/lib/db";
import { deleteMedia, addMediaUrl } from "@/app/admin/(protected)/actions";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const items = (await query`SELECT * FROM media ORDER BY created_at DESC`) as any[];

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem 0.875rem",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Storage</p>
        <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          Media Manager
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Add external media URLs. {items.length} file{items.length !== 1 ? "s" : ""} registered.
        </p>
      </div>

      {/* Add URL card */}
      <div
        className="mb-8 rounded-2xl p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <div className="mb-5 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Link2 size={18} color="#fff" />
          </div>
          <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>
            Register Media URL
          </h2>
        </div>
        <form action={addMediaUrl} className="grid gap-4 md:grid-cols-[1fr_180px_180px_auto] md:items-end">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              URL
            </label>
            <input name="url" type="url" required placeholder="https://..." style={inputStyle} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              File name
            </label>
            <input name="file_name" type="text" placeholder="photo.jpg" style={inputStyle} />
          </div>
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Category
            </label>
            <select
              name="bucket"
              style={{ ...inputStyle, width: undefined }}
            >
              <option value="profile-images">Profile images</option>
              <option value="project-images">Project images</option>
              <option value="certificates">Certificates</option>
              <option value="resume">Resume</option>
              <option value="external">External</option>
            </select>
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "var(--gradient-brand)", boxShadow: "0 2px 12px rgba(168,136,79,0.3)" }}
          >
            <Link2 size={16} />
            Add
          </button>
        </form>
      </div>

      {/* File grid */}
      {items.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <ImageIcon size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>No media registered yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((m) => {
            const isImage = m.mime_type?.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(m.url || "");
            return (
              <div
                key={m.id}
                className="overflow-hidden rounded-2xl"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                {isImage && m.url ? (
                  <div className="relative h-40 overflow-hidden" style={{ background: "var(--bg-elevated)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={m.url} alt={m.file_name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="flex h-24 items-center justify-center"
                    style={{ background: "var(--bg-elevated)" }}
                  >
                    <FileText size={32} style={{ color: "var(--text-muted)" }} />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {m.file_name}
                      </p>
                      <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        {m.bucket}
                        {m.size_bytes ? ` · ${m.size_bytes > 1024 * 1024 ? `${(m.size_bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(m.size_bytes / 1024)} KB`}` : ""}
                      </p>
                    </div>
                    <form
                      action={deleteMedia.bind(null, m.id)}
                      onSubmit={(e) => { if (!confirm(`Delete "${m.file_name}"?`)) e.preventDefault(); }}
                    >
                      <button
                        title="Delete"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all"
                        style={{
                          background: "var(--error-bg)",
                          border: "1px solid var(--error-border)",
                          color: "var(--error)",
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                  {m.url && (
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-xs font-semibold transition-colors"
                      style={{ color: "var(--cyan)" }}
                    >
                      View ↗
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
