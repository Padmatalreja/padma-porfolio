import type { Metadata } from "next";
import { MapPin, Calendar, CheckCircle2, Trophy } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import { ProseContent } from "@/components/public/prose-content";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/experience");
  return {
    title: meta?.meta_title ?? "Experience",
    description: meta?.meta_description ?? "Professional experience in software quality assurance.",
    alternates: { canonical: "/experience" },
  };
}

export default async function ExperiencePage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/experience"] ?? null;
  const subheading = meta?.subheading ?? "Roles, responsibilities, and delivery experience across banking and technology products.";

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,0,212,0.12) 0%, transparent 70%)",
            top: "-60px",
            left: "20%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Career</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Professional{" "}
              <span className="gradient-text">Experience</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        {d.experiences.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>No experience entries yet.</p>
          </div>
        ) : (
          <div className="relative space-y-0">
            {/* Vertical timeline line */}
            <div
              className="absolute left-5 top-3 bottom-3 w-px hidden md:block"
              style={{
                background:
                  "linear-gradient(180deg, var(--purple) 0%, var(--cyan) 60%, transparent 100%)",
                opacity: 0.4,
              }}
            />

            {d.experiences.map((exp, i) => (
              <MotionReveal key={`${exp.position}-${exp.organization}-${i}`} delay={i * 0.1}>
                <div className="relative flex gap-6 pb-10 md:ml-12">
                  {/* Timeline dot (hidden on mobile) */}
                  <div
                    className="absolute -left-[2.95rem] top-1.5 hidden h-3 w-3 rounded-full md:block"
                    style={{
                      background: "var(--gradient-brand)",
                      boxShadow: "0 0 12px rgba(201,168,118,0.5)",
                    }}
                  />

                  {/* Card */}
                  <div
                    className="hover-card flex-1 rounded-2xl p-6"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {/* Header row */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2
                          className="text-xl font-bold sm:text-2xl"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {exp.position}
                        </h2>
                        <p
                          className="mt-1 font-semibold"
                          style={{ color: "var(--purple-light)" }}
                        >
                          {exp.organization}
                        </p>
                      </div>
                      <span
                        className="inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold"
                        style={{
                          background: exp.is_current
                            ? "rgba(0,229,255,0.1)"
                            : "rgba(201,168,118,0.1)",
                          border: `1px solid ${exp.is_current ? "rgba(0,229,255,0.3)" : "rgba(201,168,118,0.3)"}`,
                          color: exp.is_current ? "var(--cyan)" : "var(--purple-light)",
                        }}
                      >
                        {exp.is_current ? "● Current" : "Previous"}
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap gap-3">
                      {exp.location && (
                        <span
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <MapPin size={12} />
                          {exp.location}
                        </span>
                      )}
                      {(exp.start_date || exp.end_date) && (
                        <span
                          className="flex items-center gap-1.5 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <Calendar size={12} />
                          {formatDate(exp.start_date)} —{" "}
                          {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    {exp.description && (
                      <ProseContent html={exp.description} className="mt-4" />
                    )}

                    {/* Responsibilities */}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <div className="mt-5">
                        <p
                          className="mb-3 text-xs font-bold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Key Responsibilities
                        </p>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {exp.responsibilities.map((item, ri) => (
                            <li
                              key={ri}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <CheckCircle2
                                size={14}
                                className="mt-0.5 shrink-0"
                                style={{ color: "var(--purple-light)" }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievements */}
                    {exp.achievements && exp.achievements.length > 0 && (
                      <div className="mt-5">
                        <p
                          className="mb-3 text-xs font-bold uppercase tracking-wider"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Achievements
                        </p>
                        <ul className="space-y-2">
                          {exp.achievements.map((item, ai) => (
                            <li
                              key={ai}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Trophy
                                size={14}
                                className="mt-0.5 shrink-0"
                                style={{ color: "var(--cyan)" }}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </MotionReveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
