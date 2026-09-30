import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Download, MapPin, CheckCircle2, Star, Briefcase, Code2 } from "lucide-react";
import { getPortfolioData } from "@/lib/data";
import { ProfileVisual } from "@/components/public/profile-visual";
import { MotionReveal, StaggerReveal, LineDraw, TiltCard } from "@/components/public/motion-reveal";
import { JsonLd } from "@/components/public/json-ld";
import { ProseContent } from "@/components/public/prose-content";
import { siteUrl } from "@/lib/env";

export const metadata: Metadata = { alternates: { canonical: "/" } };
// Always fetch fresh data so admin changes show immediately.
export const revalidate = 0;

export default async function HomePage() {
  const data             = await getPortfolioData();
  const { profile }      = data;
  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 3);
  const services         = (data as any).services as any[] ?? [];
  const testimonials     = (data as any).testimonials as any[] ?? [];
  const homeMeta         = data.pageMeta?.["/"] ?? null;

  /* ── helpers ── */
  const nameParts = profile.full_name.split(" ");

  // Build marquee items from all skills in the DB; fall back to sensible defaults
  const allSkillNames: string[] = data.skillCategories.flatMap(
    (cat) => cat.skills?.map((s) => s.name) ?? []
  );
  const marqueeFallback = [
    "Quality Assurance", "Manual Testing", "Automation Testing",
    "API Testing", "Performance Testing", "Test Documentation",
  ];
  const marqueeBase  = allSkillNames.length >= 4 ? allSkillNames : marqueeFallback;
  const marqueeItems = [...marqueeBase, ...marqueeBase]; // duplicate for seamless CSS scroll

  // Derive the italic accent for the About heading from professional_title.
  // Take the first segment before "|", "·", or "—" separators.
  const titleAccent = profile.professional_title
    ? profile.professional_title.split(/\s*[|·—]\s*/)[0].trim()
    : nameParts[nameParts.length - 1];

  const cvDownloadUrl = profile.resume_url
    ? `/api/download-cv?url=${encodeURIComponent(profile.resume_url)}&name=${encodeURIComponent(profile.full_name)}`
    : null;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name:     profile.full_name,
    jobTitle: profile.professional_title,
    email:    `mailto:${profile.email}`,
    telephone: profile.phone || undefined,
    address:   profile.location
      ? { "@type": "PostalAddress", addressLocality: profile.location }
      : undefined,
    url:    siteUrl,
    sameAs: data.socialLinks.map((l) => l.url),
  };

  return (
    <>
      <JsonLd data={personSchema} />

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-viewport editorial split
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[calc(100vh-68px)] overflow-hidden"
        style={{ background: "var(--bg-base)" }}
      >
        {/* Warm wash — top-right */}
        <div
          className="glow-orb pointer-events-none"
          style={{
            width:   "500px",
            height:  "500px",
            background: "radial-gradient(circle, rgba(201,168,118,0.22) 0%, transparent 70%)",
            top:     "-80px",
            right:   "-60px",
          }}
        />
        {/* Warm wash — bottom-left */}
        <div
          className="glow-orb pointer-events-none"
          style={{
            width:   "380px",
            height:  "380px",
            background: "radial-gradient(circle, rgba(107,78,55,0.10) 0%, transparent 70%)",
            bottom:  "0",
            left:    "-60px",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-10">
          <div className="grid min-h-[calc(100vh-68px)] gap-8 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-16">

            {/* ── Left — text ── */}
            <MotionReveal>
              <div className="pt-12 pb-6 lg:py-0">

                {/* Eyebrow */}
                <p className="eyebrow mb-6" style={{ color: "var(--tan-dark)" }}>
                  {profile.availability_status || "Available for opportunities"}
                </p>

                {/* Name — huge editorial serif */}
                <h1
                  style={{
                    fontFamily:   "var(--font-display)",
                    fontSize:     "clamp(3.2rem, 8vw, 6.5rem)",
                    fontWeight:   700,
                    lineHeight:   1.05,
                    letterSpacing: "-0.02em",
                    color:        "var(--brown-deep)",
                  }}
                >
                  {nameParts.map((word, i) => (
                    <span key={i} className="block">
                      {i === nameParts.length - 1
                        ? <em style={{ fontStyle: "italic", color: "var(--tan-dark)" }}>{word}</em>
                        : word}
                    </span>
                  ))}
                </h1>

                {/* Thin divider — animated editorial rule */}
                <LineDraw width={64} className="my-6" delay={0.3} />

                {/* Title */}
                <p
                  style={{
                    fontFamily:   "var(--font-sans)",
                    fontSize:     "1rem",
                    fontWeight:   500,
                    letterSpacing: "0.04em",
                    color:        "var(--text-secondary)",
                    maxWidth:     "480px",
                    lineHeight:   1.65,
                  }}
                >
                  {profile.professional_title}
                </p>

                {/* Hero text */}
                {(profile.hero_text || profile.short_intro) && (
                  <p
                    className="mt-4"
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize:   "0.95rem",
                      color:      "var(--text-secondary)",
                      maxWidth:   "460px",
                      lineHeight: 1.75,
                    }}
                  >
                    {profile.hero_text || profile.short_intro}
                  </p>
                )}

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="btn-primary"
                    style={{ letterSpacing: "0.06em", fontSize: "0.8rem" }}
                  >
                    Let&apos;s Work Together
                  </Link>
                  <Link
                    href="/projects"
                    className="btn-outline"
                    style={{ letterSpacing: "0.06em", fontSize: "0.8rem" }}
                  >
                    View My Work
                    <ArrowRight size={15} />
                  </Link>
                  {cvDownloadUrl ? (
                    <a
                      href={cvDownloadUrl}
                      className="link-muted inline-flex items-center gap-2 text-sm font-medium"
                    >
                      <Download size={15} />
                      Download CV
                    </a>
                  ) : null}
                </div>

                {/* Location */}
                {profile.location && (
                  <p
                    className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <MapPin size={12} />
                    {profile.location}
                  </p>
                )}
              </div>
            </MotionReveal>

            {/* ── Right — profile portrait ── */}
            <MotionReveal delay={0.15}>
              <div className="relative flex justify-center pb-12 lg:pb-0 lg:justify-end">
                {/* Background block — editorial bleed effect */}
                <div
                  className="absolute right-0 top-8 bottom-8 w-[88%] rounded-2xl"
                  style={{
                    background: "var(--bg-elevated)",
                    border:     "1px solid var(--border)",
                    zIndex:     0,
                  }}
                />
                <div className="relative z-10 w-full max-w-[360px]">
                  <TiltCard intensity={6} className="gentle-float">
                    <ProfileVisual
                      name={profile.full_name}
                      src={profile.profile_image_url}
                      size="lg"
                    />
                  </TiltCard>
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARQUEE TICKER — scrolling specialization keywords
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="marquee-strip overflow-hidden"
        role="marquee"
        aria-label="Specialisations ticker"
        aria-roledescription="scrolling list of specialisations"
        style={{
          borderTop:    "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          background:   "var(--bg-elevated)",
          padding:      "0.75rem 0",
        }}
      >
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" aria-hidden="true">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          ABOUT SNIPPET — asymmetric editorial spread
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <MotionReveal>
          <div className="grid gap-16 lg:grid-cols-[0.85fr_1fr] lg:items-start">
            {/* Left — heading col */}
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4">About Me</p>
              <h2
                style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     "clamp(2rem, 4vw, 3rem)",
                  fontWeight:   700,
                  lineHeight:   1.2,
                  color:        "var(--brown-deep)",
                  letterSpacing: "-0.01em",
                }}
              >
                {homeMeta?.heading ?? "Detail-oriented"}
                <br />
                <em style={{ fontStyle: "italic", color: "var(--tan-dark)" }}>
                  {titleAccent}
                </em>
              </h2>
              <LineDraw width={48} className="mt-5" delay={0.2} />
              <div className="mt-6 space-y-3 text-sm" style={{ color: "var(--text-secondary)", lineHeight: 1.75 }}>
                {data.experiences[0] && (
                  <p>
                    <span style={{ fontWeight: 600, color: "var(--brown-deep)" }}>
                      {data.experiences[0].position}
                    </span>{" "}
                    at {data.experiences[0].organization}
                  </p>
                )}
                {data.education[0] && (
                  <p>{data.education[0].degree}, {data.education[0].institution}</p>
                )}
              </div>
              <Link
                href="/about"
                className="link-tan mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest"
              >
                Read more <ArrowRight size={13} />
              </Link>
            </div>

            {/* Right — biography + snapshot card */}
            <div className="space-y-8">
              <div
                className="prose-copy text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                <ProseContent html={profile.biography} />
              </div>

              {/* Career snapshot card */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "var(--bg-elevated)",
                  border:     "1px solid var(--border)",
                }}
              >
                <p
                  className="mb-4"
                  style={{
                    fontFamily:    "var(--font-sans)",
                    fontSize:      "0.65rem",
                    fontWeight:    600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color:         "var(--text-muted)",
                  }}
                >
                  Quick Facts
                </p>
                <dl className="grid gap-4 text-sm sm:grid-cols-2">
                  {[
                    { label: "Current Role",  value: data.experiences[0]?.position      },
                    { label: "Organization",  value: data.experiences[0]?.organization  },
                    { label: "Degree",        value: data.education[0]?.degree          },
                    { label: "Institution",   value: data.education[0]?.institution     },
                    { label: "Location",      value: profile.location                   },
                    { label: "Email",         value: profile.email                      },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label}>
                      <dt style={{
                        color:         "var(--text-muted)",
                        fontSize:      "0.65rem",
                        fontWeight:    600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}>
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium" style={{ color: "var(--brown-deep)", lineHeight: 1.4 }}>
                        {label === "Email"
                          ? <a href={`mailto:${value}`} className="link-tan">{value}</a>
                          : value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      {/* Hairline divider */}
      <div className="mx-6 lg:mx-10" style={{ height: "1px", background: "var(--border)" }} />

      {/* ══════════════════════════════════════════════════════════════
          SKILLS — editorial tag cloud
      ══════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-3">Expertise</p>
            <h2
              style={{
                fontFamily:   "var(--font-display)",
                fontSize:     "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontWeight:   700,
                color:        "var(--brown-deep)",
                lineHeight:   1.2,
              }}
            >
              Skills &amp; Tools
            </h2>
          </div>
          <Link
            href="/skills"
            className="link-tan text-xs font-semibold uppercase tracking-widest"
          >
            All skills →
          </Link>
        </div>

        <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data.skillCategories.slice(0, 6).map((cat, i) => (
            <div
              key={cat.name}
              className="card-shimmer hover-card rounded-2xl p-6 h-full"
              style={{
                background: i % 2 === 0 ? "var(--bg-elevated)" : "var(--bg-card)",
                border:     "1px solid var(--border)",
              }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "1rem",
                  fontWeight: 600,
                  color:      "var(--brown-deep)",
                }}
              >
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills?.slice(0, 8).map((s) => (
                  <span key={s.name} className="skill-chip">
                    {s.name}
                  </span>
                ))}
                {(cat.skills?.length || 0) > 8 && (
                  <span className="skill-chip" style={{ color: "var(--tan-dark)" }}>
                    +{(cat.skills?.length || 0) - 8}
                  </span>
                )}
              </div>
            </div>
          ))}
        </StaggerReveal>
      </section>

      <div className="mx-6 lg:mx-10" style={{ height: "1px", background: "var(--border)" }} />

      {/* ══════════════════════════════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════════════════════════ */}
      {services.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">What I Do</p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color:      "var(--brown-deep)",
                  lineHeight: 1.2,
                }}
              >
                Services
              </h2>
            </div>
            <Link
              href="/services"
              className="link-tan text-xs font-semibold uppercase tracking-widest"
            >
              All services →
            </Link>
          </div>
          <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((svc: any, i: number) => (
              <div
                key={svc.title || i}
                className="card-shimmer hover-card rounded-2xl p-7 h-full"
                style={{
                  background: "var(--bg-elevated)",
                  border:     "1px solid var(--border)",
                }}
              >
                {svc.icon && (
                  <span className="mb-4 block text-2xl">{svc.icon}</span>
                )}
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize:   "1.1rem",
                    fontWeight: 600,
                    color:      "var(--brown-deep)",
                  }}
                >
                  {svc.title}
                </h3>
                {svc.description && (
                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {svc.description}
                  </p>
                )}
              </div>
            ))}
          </StaggerReveal>
        </section>
      )}

      <div className="mx-6 lg:mx-10" style={{ height: "1px", background: "var(--border)" }} />

      {/* ══════════════════════════════════════════════════════════════
          EXPERIENCE PREVIEW
      ══════════════════════════════════════════════════════════════ */}
      {data.experiences.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">Career</p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color:      "var(--brown-deep)",
                  lineHeight: 1.2,
                }}
              >
                Experience
              </h2>
            </div>
            <Link
              href="/experience"
              className="link-tan text-xs font-semibold uppercase tracking-widest"
            >
              Full history →
            </Link>
          </div>
          <div className="space-y-5">
            {data.experiences.slice(0, 2).map((exp, i) => (
              <MotionReveal key={`${exp.position}-${exp.organization}`} delay={i * 0.1}>
                <div
                  className="hover-card rounded-2xl p-7"
                  style={{
                    background: "var(--bg-elevated)",
                    border:     "1px solid var(--border)",
                  }}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize:   "1.2rem",
                          fontWeight: 600,
                          color:      "var(--brown-deep)",
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p className="mt-1 text-sm font-medium" style={{ color: "var(--tan-dark)" }}>
                        {exp.organization}
                        {exp.location && (
                          <span style={{ color: "var(--text-muted)" }}> · {exp.location}</span>
                        )}
                      </p>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                      style={{
                        background: exp.is_current
                          ? "rgba(201,168,118,0.15)"
                          : "rgba(107,78,55,0.08)",
                        border: `1px solid ${exp.is_current ? "rgba(201,168,118,0.5)" : "rgba(107,78,55,0.2)"}`,
                        color: exp.is_current ? "var(--tan-dark)" : "var(--text-secondary)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {exp.is_current ? "Current" : "Previous"}
                    </span>
                  </div>
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {exp.responsibilities.slice(0, 4).map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          <CheckCircle2
                            size={14}
                            className="mt-0.5 shrink-0"
                            style={{ color: "var(--tan)" }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </MotionReveal>
            ))}
          </div>
        </section>
      )}

      <div className="mx-6 lg:mx-10" style={{ height: "1px", background: "var(--border)" }} />

      {/* ══════════════════════════════════════════════════════════════
          FEATURED PROJECTS — editorial magazine grid
      ══════════════════════════════════════════════════════════════ */}
      {featuredProjects.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <div className="mb-14 flex items-end justify-between">
            <div>
              <p className="eyebrow mb-3">Portfolio</p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color:      "var(--brown-deep)",
                  lineHeight: 1.2,
                }}
              >
                Selected Work
              </h2>
            </div>
            <Link
              href="/projects"
              className="link-tan text-xs font-semibold uppercase tracking-widest"
            >
              All projects →
            </Link>
          </div>

          <StaggerReveal className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <TiltCard key={project.slug} intensity={5}>
                <Link href={`/projects/${project.slug}`} className="group block h-full">
                  <div
                    className="card-shimmer hover-card-lift h-full overflow-hidden rounded-2xl"
                    style={{
                      background: "var(--bg-elevated)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    {/* Image */}
                    {project.thumbnail_url ? (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={project.thumbnail_url}
                          alt={project.title}
                          fill
                          sizes="(max-width:768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                          unoptimized={project.thumbnail_url?.startsWith("/uploads/")}
                        />
                        {/* Overlay with title on hover */}
                        <div
                          className="absolute inset-0 flex items-end p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{
                            background: "linear-gradient(to top, rgba(74,55,40,0.85) 0%, transparent 60%)",
                          }}
                        >
                          <p
                            style={{
                              fontFamily: "var(--font-display)",
                              fontSize:   "1rem",
                              fontWeight: 600,
                              color:      "#F5EFE6",
                              fontStyle:  "italic",
                            }}
                          >
                            {project.title}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="h-52 flex items-center justify-center"
                        style={{ background: "var(--bg-card)" }}
                      >
                        <Code2 size={32} style={{ color: "var(--tan)" }} />
                      </div>
                    )}

                    <div className="p-5">
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize:   "1rem",
                          fontWeight: 600,
                          color:      "var(--brown-deep)",
                        }}
                      >
                        {project.title}
                      </h3>
                      <p
                        className="mt-2 text-sm line-clamp-2"
                        style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
                      >
                        {project.description}
                      </p>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((t) => (
                            <span key={t} className="skill-chip" style={{ fontSize: "0.65rem" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </StaggerReveal>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TESTIMONIALS — if any
      ══════════════════════════════════════════════════════════════ */}
      {testimonials.length > 0 && (
        <>
          <div className="mx-6 lg:mx-10" style={{ height: "1px", background: "var(--border)" }} />
          <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
            <div className="mb-14 text-center">
              <p className="eyebrow mb-3">Social Proof</p>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize:   "clamp(1.75rem, 3.5vw, 2.5rem)",
                  fontWeight: 700,
                  color:      "var(--brown-deep)",
                }}
              >
                What People Say
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t: any, i: number) => (
                <MotionReveal key={i} delay={i * 0.08}>
                  <div
                    className="rounded-2xl p-7"
                    style={{
                      background: i % 2 === 1 ? "var(--bg-elevated)" : "var(--bg-card)",
                      border:     "1px solid var(--border)",
                    }}
                  >
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star
                          key={s}
                          size={13}
                          fill={s < (t.rating || 5) ? "var(--tan)" : "none"}
                          style={{ color: "var(--tan)" }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize:   "0.95rem",
                        fontStyle:  "italic",
                        lineHeight: 1.7,
                        color:      "var(--text-secondary)",
                      }}
                    >
                      &ldquo;{t.content}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "var(--tan)", color: "#F5EFE6" }}
                      >
                        {t.author_name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--brown-deep)" }}>
                          {t.author_name}
                        </p>
                        {t.author_title && (
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {t.author_title}{t.company && `, ${t.company}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </MotionReveal>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════
          CTA — warm editorial close
      ══════════════════════════════════════════════════════════════ */}
      <section
        className="mx-6 mb-12 overflow-hidden rounded-2xl lg:mx-10"
        style={{
          background: "var(--bg-elevated)",
          border:     "1px solid var(--border)",
        }}
      >
        <MotionReveal>
          <div className="grid gap-0 lg:grid-cols-[1fr_auto]">
            {/* Text */}
            <div className="px-10 py-14 lg:py-16">
              <p className="eyebrow mb-4">Let&apos;s Collaborate</p>
              <h2
                style={{
                  fontFamily:   "var(--font-display)",
                  fontSize:     "clamp(1.75rem, 3.5vw, 2.75rem)",
                  fontWeight:   700,
                  color:        "var(--brown-deep)",
                  lineHeight:   1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                Interested in working <br />
                <em style={{ fontStyle: "italic", color: "var(--tan-dark)" }}>together?</em>
              </h2>
              <p
                className="mt-4 max-w-md text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {homeMeta?.subheading ??
                  "Open to professional opportunities, collaboration, and new projects."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="btn-primary"
                  style={{ letterSpacing: "0.06em", fontSize: "0.8rem" }}
                >
                  Get in Touch
                </Link>
                <Link
                  href="/projects"
                  className="btn-outline"
                  style={{ letterSpacing: "0.06em", fontSize: "0.8rem" }}
                >
                  View My Work <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Accent block */}
            <div
              className="hidden lg:block w-48"
              style={{ background: "var(--tan)", opacity: 0.3 }}
            />
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
