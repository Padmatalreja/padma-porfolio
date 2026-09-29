"use client";
import { useMemo, useState } from "react";
import { ExternalLink, BookOpen } from "lucide-react";
import type { Publication } from "@/types/portfolio";

export function PublicationsClient({ items }: { items: Publication[] }) {
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");

  const years = Array.from(
    new Set(items.map((x) => x.year).filter((x): x is number => typeof x === "number"))
  ).sort((a, b) => b - a);

  const types = Array.from(
    new Set(items.map((x) => x.publication_type).filter((x): x is string => Boolean(x)))
  );

  const shown = useMemo(
    () =>
      items.filter(
        (x) =>
          (year === "all" || String(x.year) === year) &&
          (type === "all" || x.publication_type === type)
      ),
    [items, year, type]
  );

  const selectStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <>
      {/* Filters */}
      {(years.length > 0 || types.length > 0) && (
        <div className="mb-8 flex flex-wrap gap-3">
          {years.length > 0 && (
            <select
              aria-label="Filter by year"
              style={selectStyle}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          )}
          {types.length > 0 && (
            <select
              aria-label="Filter by type"
              style={selectStyle}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="all">All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-5">
        {shown.map((pub, i) => (
          <div
            key={`${pub.title}-${i}`}
            className="rounded-2xl p-6 transition-all duration-300"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(124,58,237,0.35)";
              el.style.boxShadow = "0 4px 20px rgba(124,58,237,0.08)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border)";
              el.style.boxShadow = "none";
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2
                className="max-w-2xl text-lg font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {pub.title}
              </h2>
              {pub.publication_type && (
                <span
                  className="shrink-0 rounded-full px-3 py-0.5 text-xs font-semibold"
                  style={{
                    background: "rgba(124,58,237,0.12)",
                    border: "1px solid rgba(124,58,237,0.3)",
                    color: "var(--purple-light)",
                  }}
                >
                  {pub.publication_type}
                </span>
              )}
            </div>

            {pub.authors && pub.authors.length > 0 && (
              <p className="mt-2 text-sm" style={{ color: "var(--purple-light)" }}>
                {pub.authors.join(", ")}
              </p>
            )}

            <p className="mt-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
              {[pub.journal || pub.conference, pub.year ? `${pub.year}` : null,
                pub.volume ? `Vol. ${pub.volume}` : null,
                pub.pages ? `pp. ${pub.pages}` : null]
                .filter(Boolean)
                .join(" · ")}
            </p>

            {pub.abstract && (
              <p
                className="mt-3 text-sm leading-relaxed line-clamp-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {pub.abstract}
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-3">
              {pub.doi && (
                <a
                  href={`https://doi.org/${pub.doi}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: "var(--cyan)" }}
                >
                  <ExternalLink size={12} />
                  DOI: {pub.doi}
                </a>
              )}
              {pub.url && !pub.doi && (
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: "var(--cyan)" }}
                >
                  <ExternalLink size={12} />
                  View Publication
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {shown.length === 0 && (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <BookOpen size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No publications match this filter.</p>
        </div>
      )}
    </>
  );
}
