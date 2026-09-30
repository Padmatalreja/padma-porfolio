"use client";
import Link from "next/link";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminField } from "@/components/admin/field";
import type { SectionConfig } from "@/lib/admin-config";
import {
  deleteProjectImage,
  deleteRecord,
  moveRecord,
  saveRecord,
} from "@/app/admin/(protected)/actions";

function recordTitle(record: Record<string, unknown>, config: SectionConfig): string {
  return String(
    record.title ??
      record.name ??
      record.full_name ??
      record.position ??
      record.degree ??
      record.platform ??
      record.author_name ??
      config.singular
  );
}

export function AdminSection({
  section,
  config,
  records,
  editing,
  selectOptions,
  saved,
  projectImages = [],
}: {
  section: string;
  config: SectionConfig;
  records: Record<string, unknown>[];
  editing?: Record<string, unknown> | null;
  selectOptions?: Record<string, Array<{ label: string; value: string }>>;
  saved?: boolean;
  projectImages?: Array<{ id: string; project_id: string; image_url: string }>;
}) {
  const boundSave = saveRecord.bind(null, section);

  return (
    <div className="mx-auto max-w-7xl">
      {/* Page header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Content Management</p>
          <h1
            className="text-3xl font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {config.label}
          </h1>
        </div>
        {!config.singleton && (
          <Link
            href={`/admin/${section}?new=1`}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
            style={{ background: "var(--gradient-brand)", boxShadow: "0 2px 12px rgba(168,136,79,0.3)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(168,136,79,0.5)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(168,136,79,0.3)";
            }}
          >
            <Plus size={17} />
            Add {config.singular}
          </Link>
        )}
      </div>

      {/* Saved toast */}
      {saved && (
        <div
          className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold"
          style={{
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            color: "var(--success)",
          }}
        >
          <CheckCircle2 size={17} />
          Changes saved successfully.
        </div>
      )}

      <div className="grid gap-8 xl:grid-cols-[1fr_0.85fr]">
        {/* ── Record list ── */}
        <div>
          <h2
            className="mb-4 text-base font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            {records.length} record{records.length !== 1 ? "s" : ""}
          </h2>
          <div className="space-y-3">
            {records.map((r, i) => (
              <div
                key={String(r.id ?? i)}
                className="flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                style={{
                  background: "var(--bg-card)",
                  border:
                    editing?.id === r.id
                      ? "1px solid rgba(201,168,118,0.5)"
                      : "1px solid var(--border)",
                  boxShadow: editing?.id === r.id
                    ? "0 0 20px rgba(201,168,118,0.12)"
                    : "none",
                }}
              >
                <div className="min-w-0">
                  <p
                    className="truncate font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {recordTitle(r, config)}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    {r.is_public === false ? "Hidden" : "Public"}
                    {typeof r.display_order === "number"
                      ? ` · #${r.display_order}`
                      : ""}
                    {r.featured ? " · ★ Featured" : ""}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {/* Edit */}
                  <Link
                    href={`/admin/${section}?edit=${r.id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      background: "rgba(201,168,118,0.1)",
                      border: "1px solid rgba(201,168,118,0.25)",
                      color: "var(--tan-dark)",
                    }}
                  >
                    <Pencil size={13} />
                    Edit
                  </Link>

                  {/* Reorder */}
                  {config.orderable && (
                    <>
                      <form action={moveRecord.bind(null, section, String(r.id), "up")}>
                        <button
                          disabled={i === 0}
                          title="Move up"
                          aria-label={`Move ${recordTitle(r, config)} up`}
                          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all disabled:opacity-30"
                          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          <ArrowUp size={14} />
                        </button>
                      </form>
                      <form action={moveRecord.bind(null, section, String(r.id), "down")}>
                        <button
                          disabled={i === records.length - 1}
                          title="Move down"
                          aria-label={`Move ${recordTitle(r, config)} down`}
                          className="flex h-8 w-8 items-center justify-center rounded-xl transition-all disabled:opacity-30"
                          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </form>
                    </>
                  )}

                  {/* Delete */}
                  {!config.singleton && (
                    <form
                      action={deleteRecord.bind(null, section, String(r.id))}
                      onSubmit={(e) => {
                        if (
                          !confirm(
                            `Delete "${recordTitle(r, config)}"? This cannot be undone.`
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                    >
                      <button
                        title={`Delete ${recordTitle(r, config)}`}
                        aria-label={`Delete ${recordTitle(r, config)}`}
                        className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
                        style={{
                          background: "var(--error-bg)",
                          border: "1px solid var(--error-border)",
                          color: "var(--error)",
                        }}
                        onMouseEnter={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "rgba(248,113,113,0.14)";
                          el.style.borderColor = "rgba(248,113,113,0.4)";
                        }}
                        onMouseLeave={(e) => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = "var(--error-bg)";
                          el.style.borderColor = "var(--error-border)";
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}

            {records.length === 0 && (
              <div
                className="rounded-2xl p-10 text-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  No records yet. {!config.singleton && 'Click "Add" above to create one.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Add / Edit form ── */}
        {(editing || config.singleton || records.length === 0) && (
          <div>
            <Card>
              <CardContent className="p-6">
                <h2
                  className="mb-6 text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {editing?.id
                    ? `Edit ${config.singular}`
                    : `Add ${config.singular}`}
                </h2>

                {/* Profile file previews */}
                {section === "profile" && editing && (
                  <div
                    className="mb-5 space-y-2 rounded-xl p-4"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Current files
                    </p>
                    {editing.profile_image_url ? (
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={String(editing.profile_image_url)}
                          alt="Profile"
                          className="h-14 w-14 rounded-xl object-cover"
                          style={{ border: "1px solid var(--border)" }}
                        />
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                            Profile image
                          </p>
                          <a
                            href={String(editing.profile_image_url)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs transition-colors"
                            style={{ color: "var(--tan-dark)" }}
                          >
                            View full
                          </a>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        No profile image uploaded yet.
                      </p>
                    )}
                    {editing.resume_url ? (
                      <a
                        href={String(editing.resume_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: "var(--cyan)" }}
                      >
                        📄 Download current CV
                      </a>
                    ) : (
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        No CV uploaded yet.
                      </p>
                    )}
                  </div>
                )}

                <form
                  action={boundSave}
                  className="space-y-5"
                >
                  {editing?.id ? (
                    <input type="hidden" name="id" value={String(editing.id as string)} />
                  ) : null}

                  {config.fields.map((field) => (
                    <AdminField
                      key={field.name}
                      field={field}
                      value={editing?.[field.name]}
                      options={selectOptions?.[field.name]}
                    />
                  ))}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button type="submit" variant="gradient">
                      Save changes
                    </Button>
                    {editing?.id != null && !config.singleton ? (
                      <Link
                        href={`/admin/${section}`}
                        className="inline-flex items-center rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all"
                        style={{
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Cancel
                      </Link>
                    ) : null}
                  </div>
                </form>

                {/* Project gallery */}
                {section === "projects" &&
                  editing?.id != null &&
                  projectImages.filter((img) => img.project_id === (editing.id as string)).length > 0 && (
                    <div
                      className="mt-8 pt-6"
                      style={{ borderTop: "1px solid var(--border)" }}
                    >
                      <h3
                        className="mb-4 flex items-center gap-2 font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <ImageIcon size={16} style={{ color: "var(--tan-dark)" }} />
                        Project Gallery
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {projectImages
                          .filter((img) => img.project_id === editing.id)
                          .map((img) => (
                            <div
                              key={img.id}
                              className="group relative overflow-hidden rounded-xl"
                              style={{ border: "1px solid var(--border)" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={img.image_url}
                                alt="Project"
                                className="h-36 w-full object-cover"
                              />
                              <div
                                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
                                style={{ background: "rgba(0,0,0,0.6)" }}
                              >
                                <form action={deleteProjectImage.bind(null, img.id)}>
                                  <button
                                    className="rounded-xl px-3 py-1.5 text-xs font-bold"
                                    style={{
                                      background: "var(--error-bg)",
                                      border: "1px solid var(--error-border)",
                                      color: "var(--error)",
                                    }}
                                    onClick={(e) => {
                                      if (!confirm("Delete this image?")) e.preventDefault();
                                    }}
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </form>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
