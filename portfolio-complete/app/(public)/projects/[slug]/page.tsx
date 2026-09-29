import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Calendar, Tag, Code2, User } from "lucide-react";
import { getPortfolioData, getProjectBySlug } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import { ProseContent } from "@/components/public/prose-content";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description || undefined,
    alternates: { canonical: `/projects/${slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, data] = await Promise.all([getProjectBySlug(slug), getPortfolioData()]);
  if (!project) notFound();

  return (
    <>
      {/* Back nav */}
      <div className="mx-auto max-w-5xl px-5 pt-8 lg:px-8">
        <Link
          href="/projects"
          className="hover-text-primary inline-flex items-center gap-2 text-sm font-semibold transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {project.thumbnail_url ? (
          <div className="relative h-64 sm:h-80 lg:h-96">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              unoptimized={project.thumbnail_url.startsWith("/uploads/")}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, var(--bg-base) 0%, rgba(5,5,8,0.6) 50%, transparent 100%)",
              }}
            />
          </div>
        ) : (
          <div
            className="h-48"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(0,229,255,0.1) 100%)",
            }}
          >
            <div
              className="glow-orb"
              style={{
                width: "400px",
                height: "400px",
                background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
                top: "-100px",
                left: "30%",
              }}
            />
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-5xl px-5 py-10 lg:px-8">
          <MotionReveal>
            {project.featured && (
              <span
                className="mb-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
                style={{
                  background: "var(--gradient-brand)",
                  color: "#fff",
                }}
              >
                Featured Project
              </span>
            )}
            <h1
              className="text-3xl font-black sm:text-4xl lg:text-5xl"
              style={{ color: "var(--text-primary)" }}
            >
              {project.title}
            </h1>
            {project.description && (
              <p
                className="mt-4 max-w-2xl text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>
            )}

            {/* Action links */}
            <div className="mt-6 flex flex-wrap gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                >
                  <ExternalLink size={16} />
                  View Source
                </a>
              )}
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Detail grid */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          {/* Left — full description */}
          <MotionReveal delay={0.1}>
            <div>
              {project.full_description && (
                <div>
                  <p
                    className="mb-4 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    About This Project
                  </p>
                  <ProseContent html={project.full_description} />
                </div>
              )}

              {/* Gallery */}
              {project.images && project.images.length > 0 && (
                <div className="mt-8">
                  <p
                    className="mb-4 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Gallery
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.images.map((img, i) => (
                      <a
                        key={i}
                        href={img}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-xl"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={img}
                            alt={`${project.title} screenshot ${i + 1}`}
                            fill
                            sizes="(max-width:640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            loading="lazy"
                            unoptimized={img.startsWith("/uploads/")}
                          />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </MotionReveal>

          {/* Right — meta sidebar */}
          <MotionReveal delay={0.15}>
            <div className="space-y-4">
              {/* Tech stack */}
              {project.technologies && project.technologies.length > 0 && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Tag size={15} style={{ color: "var(--purple-light)" }} />
                    <p
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Technologies
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <span key={t} className="skill-chip">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Project meta */}
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <p
                  className="mb-4 text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  Project Info
                </p>
                <dl className="space-y-3">
                  {project.role && (
                    <div className="flex items-center gap-3">
                      <User size={14} style={{ color: "var(--purple-light)" }} />
                      <div>
                        <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Role</dt>
                        <dd className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {project.role}
                        </dd>
                      </div>
                    </div>
                  )}
                  {(project.start_date || project.end_date) && (
                    <div className="flex items-center gap-3">
                      <Calendar size={14} style={{ color: "var(--cyan)" }} />
                      <div>
                        <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Duration</dt>
                        <dd className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {formatDate(project.start_date)}
                          {project.end_date && ` — ${formatDate(project.end_date)}`}
                        </dd>
                      </div>
                    </div>
                  )}
                  {(project as any).category && (
                    <div className="flex items-center gap-3">
                      <Code2 size={14} style={{ color: "var(--magenta)" }} />
                      <div>
                        <dt className="text-xs" style={{ color: "var(--text-muted)" }}>Category</dt>
                        <dd className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                          {(project as any).category}
                        </dd>
                      </div>
                    </div>
                  )}
                </dl>
              </div>

              {/* Links */}
              {(project.live_url || project.github_url) && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="mb-4 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Links
                  </p>
                  <div className="space-y-2">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl p-3 text-sm font-semibold transition-all"
                        style={{
                          background: "rgba(0,229,255,0.08)",
                          border: "1px solid rgba(0,229,255,0.2)",
                          color: "var(--cyan)",
                        }}
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl p-3 text-sm font-semibold transition-all"
                        style={{
                          background: "rgba(124,58,237,0.08)",
                          border: "1px solid rgba(124,58,237,0.2)",
                          color: "var(--purple-light)",
                        }}
                      >
                        <ExternalLink size={14} />
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </MotionReveal>
        </div>

        {/* Other projects */}
        {data.projects.filter((p) => p.slug !== project.slug).length > 0 && (
          <div className="mt-16">
            <div className="section-divider mb-12" />
            <p className="eyebrow mb-6">More Projects</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects
                .filter((p) => p.slug !== project.slug)
                .slice(0, 3)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/projects/${p.slug}`}
                    className="hover-card group rounded-2xl p-5"
                  >
                    <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                      {p.title}
                    </h3>
                    <p
                      className="mt-2 text-sm line-clamp-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {p.description}
                    </p>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
