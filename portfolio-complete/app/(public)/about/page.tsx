import type { Metadata } from "next";
import { MapPin, Calendar, ArrowRight, Briefcase, Download } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { ProfileVisual } from "@/components/public/profile-visual";
import { MotionReveal } from "@/components/public/motion-reveal";
import { ProseContent } from "@/components/public/prose-content";
import { JsonLd } from "@/components/public/json-ld";
import { siteUrl } from "@/lib/env";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/about");
  return {
    title: meta?.meta_title ?? "About",
    description: meta?.meta_description ?? "Professional profile and career overview.",
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/about"] ?? null;
  const heading = meta?.heading ?? "Crafting Quality, One Test at a Time";

  // Use contactInfo as the single source of truth; fall back to profile fields
  const ci      = d.contactInfo;
  const email   = ci?.email    ?? d.profile.email    ?? null;
  const phone   = ci?.phone    ?? d.profile.phone    ?? null;
  const location = ci?.address ?? d.profile.location ?? null;

  // Build the download-cv API URL which forces Content-Disposition: attachment
  // and names the file after the person's full name regardless of the stored filename.
  const cvDownloadUrl = d.profile.resume_url
    ? `/api/download-cv?url=${encodeURIComponent(d.profile.resume_url)}&name=${encodeURIComponent(d.profile.full_name)}`
    : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: d.profile.full_name,
      jobTitle: d.profile.professional_title,
    },
    url: `${siteUrl}/about`,
  };

  const details = [
    { label: "Name",  value: d.profile.full_name },
    { label: "Title", value: d.profile.professional_title },
    location && { label: "Location", value: location },
    email    && { label: "Email",    value: email,  href: `mailto:${email}` },
    phone    && { label: "Phone",    value: phone,  href: `tel:${phone}` },
    d.profile.availability_status && { label: "Status", value: d.profile.availability_status },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            top: "-80px",
            right: "-80px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">About Me</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              {heading.includes(",") ? (
                <>
                  {heading.split(",")[0]},{" "}
                  <span className="gradient-text">{heading.split(",").slice(1).join(",").trim()}</span>
                </>
              ) : (
                <span className="gradient-text">{heading}</span>
              )}
            </h1>
            <p
              className="mt-5 max-w-2xl text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              {d.profile.short_intro}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          {/* Left — profile visual + contact card */}
          <MotionReveal delay={0.1}>
            <div className="flex flex-col items-center gap-6 lg:items-start">
              {/* Profile image with glow */}
              <div className="relative">
                <ProfileVisual
                  name={d.profile.full_name}
                  src={d.profile.profile_image_url}
                  size="lg"
                />
              </div>

              {/* Key details card */}
              <div
                className="w-full rounded-2xl p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  className="mb-5 text-sm font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-muted)" }}
                >
                  Quick Details
                </h2>
                <dl className="space-y-4">
                  {details.map(({ label, value, href }) => (
                    <div key={label} className="flex items-start gap-3">
                      <dt
                        className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {label}
                      </dt>
                      <dd
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {href ? (
                          <a
                            href={href}
                            className="transition-colors"
                            style={{ color: "var(--purple-light)" }}
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* Resume download */}
                {cvDownloadUrl ? (
                  <a
                    href={cvDownloadUrl}
                    className="btn-primary mt-6 flex w-full items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    Download CV
                  </a>
                ) : (
                  <div
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold opacity-40 cursor-not-allowed"
                    style={{
                      border: "1px dashed var(--border)",
                      color: "var(--text-muted)",
                    }}
                    title="No CV uploaded yet — add one in the admin panel under Profile"
                  >
                    <Download size={16} />
                    CV not available yet
                  </div>
                )}


              </div>
            </div>
          </MotionReveal>

          {/* Right — biography + experience snapshot */}
          <div className="space-y-10">
            <MotionReveal delay={0.15}>
              <div>
                <p className="eyebrow mb-3">Biography</p>
                <ProseContent html={d.profile.biography} className="text-lg" />
              </div>
            </MotionReveal>

            {/* Current role highlight */}
            {d.experiences[0] && (
              <MotionReveal delay={0.2}>
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid rgba(124,58,237,0.25)",
                    boxShadow: "0 0 30px rgba(124,58,237,0.06)",
                  }}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.3)",
                      }}
                    >
                      <Briefcase size={18} style={{ color: "var(--purple-light)" }} />
                    </div>
                    <p
                      className="text-sm font-bold uppercase tracking-widest"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Current Role
                    </p>
                  </div>
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {d.experiences[0].position}
                  </h3>
                  <p className="mt-1 font-semibold" style={{ color: "var(--purple-light)" }}>
                    {d.experiences[0].organization}
                  </p>
                  {d.experiences[0].location && (
                    <p
                      className="mt-0.5 flex items-center gap-1.5 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <MapPin size={13} />
                      {d.experiences[0].location}
                    </p>
                  )}
                  <div className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                    <Calendar size={13} />
                    {formatDate(d.experiences[0].start_date)} —{" "}
                    {d.experiences[0].is_current ? "Present" : formatDate(d.experiences[0].end_date)}
                  </div>
                  {d.experiences[0].description && (
                    <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {d.experiences[0].description}
                    </p>
                  )}
                </div>
              </MotionReveal>
            )}

            {/* Education */}
            {d.education[0] && (
              <MotionReveal delay={0.25}>
                <div
                  className="rounded-2xl p-6"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="mb-4 text-sm font-bold uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Education
                  </p>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {d.education[0].degree}
                  </h3>
                  <p className="mt-1 font-medium" style={{ color: "var(--cyan)" }}>
                    {d.education[0].institution}
                  </p>
                  {d.education[0].grade && (
                    <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                      {d.education[0].grade}
                    </p>
                  )}
                  {(d.education[0].start_year || d.education[0].end_year) && (
                    <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                      {d.education[0].start_year} — {d.education[0].end_year}
                    </p>
                  )}
                </div>
              </MotionReveal>
            )}

            {/* CTA links */}
            <MotionReveal delay={0.3}>
              <div className="flex flex-wrap gap-3">
                <Link href="/experience" className="btn-primary">
                  <Briefcase size={17} />
                  View Experience
                </Link>
                <Link href="/contact" className="btn-outline">
                  Get in Touch
                  <ArrowRight size={17} />
                </Link>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>
    </>
  );
}
