"use client";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/admin/image-upload";
import type { Field } from "@/lib/admin-config";

// Dynamically import the TipTap editor — it's ~180KB and only needed on
// admin pages that have richtext fields. This keeps the initial admin JS bundle small.
const RichTextEditor = dynamic(
  () => import("@/components/admin/rich-text-editor").then((m) => m.RichTextEditor),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full rounded-xl px-3 py-2.5 text-sm"
        style={{
          minHeight: "160px",
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
        }}
      >
        Loading editor…
      </div>
    ),
  }
);

function valueText(value: unknown) {
  if (Array.isArray(value)) return value.join("\n");
  if (value === null || value === undefined) return "";
  return String(value);
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.375rem",
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "var(--text-secondary)",
};

const hintStyle: React.CSSProperties = {
  marginTop: "0.25rem",
  fontSize: "0.7rem",
  color: "var(--text-muted)",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.875rem",
  background: "var(--bg-elevated)",
  border: "1px solid var(--border)",
  borderRadius: "0.75rem",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  outline: "none",
  cursor: "pointer",
  fontFamily: "var(--font-sans)",
};

export function AdminField({
  field,
  value,
  options,
}: {
  field: Field;
  value?: unknown;
  options?: Array<{ label: string; value: string }>;
}) {
  /* ── Checkbox ── */
  if (field.type === "checkbox") {
    return (
      <label
        className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
      >
        <input
          type="checkbox"
          name={field.name}
          defaultChecked={Boolean(value)}
          className="h-4 w-4 rounded"
          style={{ accentColor: "var(--tan)" }}
        />
        {field.label}
      </label>
    );
  }

  const label = (
    <label htmlFor={field.name} style={labelStyle}>
      {field.label}
      {field.required && (
        <span style={{ color: "var(--magenta)", marginLeft: "0.25rem" }}>*</span>
      )}
    </label>
  );

  /* ── Rich text (TipTap) ── */
  if (field.type === "richtext") {
    return (
      <div>
        {label}
        <RichTextEditor
          name={field.name}
          defaultValue={valueText(value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      </div>
    );
  }

  /* ── Image / file upload — saves to /public/uploads/ ── */
  if (field.type === "image-upload") {
    const isPdf =
      field.name === "resume_url" ||
      field.name.includes("resume") ||
      field.name.includes("pdf");
    const currentUrl = valueText(value);
    return (
      <div>
        {label}
        <ImageUpload
          key={currentUrl}
          name={field.name}
          defaultUrl={currentUrl}
          accept={isPdf ? "application/pdf" : "image/*"}
          isPdf={isPdf}
        />
      </div>
    );
  }

  /* ── Textarea / Array ── */
  if (field.type === "textarea" || field.type === "array") {
    return (
      <div>
        {label}
        <Textarea
          id={field.name}
          name={field.name}
          defaultValue={valueText(value)}
          required={field.required}
          placeholder={
            field.placeholder ||
            (field.type === "array" ? "One item per line" : undefined)
          }
        />
        {field.type === "array" && (
          <p style={hintStyle}>Enter one item per line.</p>
        )}
      </div>
    );
  }

  /* ── Select ── */
  if (field.type === "select") {
    return (
      <div>
        {label}
        <select
          id={field.name}
          name={field.name}
          defaultValue={valueText(value)}
          required={field.required}
          style={selectStyle}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--tan)";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,118,0.18)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <option value="">— Select —</option>
          {(options || field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  /* ── Legacy file / multiple-files — plain URL input ── */
  if (field.type === "file" || field.type === "multiple-files") {
    return (
      <div>
        {label}
        <Input
          id={field.name}
          name={field.name}
          type="url"
          defaultValue={valueText(value)}
          placeholder="https://..."
        />
        <p style={hintStyle}>Paste a public URL for this file.</p>
      </div>
    );
  }

  /* ── Default: text / email / url / date / number ── */
  return (
    <div>
      {label}
      <Input
        id={field.name}
        name={field.name}
        type={field.type}
        defaultValue={valueText(value)}
        required={field.required}
        placeholder={field.placeholder}
      />
    </div>
  );
}
