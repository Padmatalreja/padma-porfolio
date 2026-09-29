"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Code2, ExternalLink, ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/portfolio";

interface Props {
  projects: Project[];
}

export function ProjectsClient({ projects }: Props) {
  // Collect unique categories
  const categories = ["All", ...Array.from(
    new Set(projects.map((p) => (p as any).category).filter(Boolean))
  )];

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => (p as any).category === active);

  return (
    <div>
      {/* Category filters */}
      {categories.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className="rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200"
              style={{
                background:
                  active === cat
                    ? "var(--gradient-brand)"
                    : "var(--bg-elevated)",
                border: `1px solid ${active === cat ? "transparent" : "var(--border)"}`,
                color: active === cat ? "#fff" : "var(--text-secondary)",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <p style={{ color: "var(--text-muted)" }}>No projects in this category.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div
              key={project.slug}
              className="group flex flex-col overflow-hidden rounded-2xl transition-all duration-300"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "rgba(124,58,237,0.45)";
                el.style.boxShadow = "0 8px 32px rgba(124,58,237,0.15)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "var(--border)";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Thumbnail */}
              <Link href={`/projects/${project.slug}`} className="block">
                {project.thumbnail_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.thumbnail_url}
                      alt={project.title}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      unoptimized={project.thumbnail_url?.startsWith("/uploads/")}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(13,13,20,0.85) 0%, transparent 50%)",
                      }}
                    />
                    {project.featured && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "var(--gradient-brand)",
                          color: "#fff",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <div
                    className="relative h-48 flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(0,229,255,0.08) 100%)",
                    }}
                  >
                    <Code2 size={40} style={{ color: "var(--purple-mid)", opacity: 0.6 }} />
                    {project.featured && (
                      <span
                        className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: "var(--gradient-brand)",
                          color: "#fff",
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/projects/${project.slug}`}>
                    <h2
                      className="text-lg font-bold transition-colors"
                      style={{ color: "var(--text-primary)" }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "var(--purple-light)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
                      }
                    >
                      {project.title}
                    </h2>
                  </Link>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </div>

                {(project as any).category && (
                  <p className="mt-1 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    {(project as any).category}
                  </p>
                )}

                <p
                  className="mt-2 flex-1 text-sm leading-relaxed line-clamp-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {project.description}
                </p>

                {/* Tech tags */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.technologies.slice(0, 5).map((t) => (
                      <span key={t} className="skill-chip" style={{ fontSize: "0.7rem" }}>
                        {t}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="skill-chip" style={{ fontSize: "0.7rem", color: "var(--purple-light)" }}>
                        +{project.technologies.length - 5}
                      </span>
                    )}
                  </div>
                )}

                {/* Action links */}
                {(project.live_url || project.github_url) && (
                  <div className="mt-4 flex gap-3 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: "var(--cyan)" }}
                      >
                        <ExternalLink size={13} />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                        style={{ color: "var(--purple-light)" }}
                      >
                        <ExternalLink size={13} />
                        Source
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
