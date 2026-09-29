import type { Metadata } from "next";
import { GraduationCap, Trophy } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/education");
  return {
    title: meta?.meta_title ?? "Education",
    description: meta?.meta_description ?? "Academic background and qualifications.",
    alternates: { canonical: "/education" },
  };
}

export default async function EducationPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/education"] ?? null;
  const subheading = meta?.subheading ?? "Academic foundations and coursework that shaped a systems-oriented engineering mindset.";

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)",
            top: "-60px",
            right: "15%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Academic Background</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Education &amp;{" "}
              <span className="gradient-text">Qualifications</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        {d.education.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>No education records yet.</p>
          </div>
        ) : (
          <div className="relative space-y-0">
            {/* Timeline line */}
            <div
              className="absolute left-5 top-3 bottom-3 w-px hidden md:block"
              style={{
                background:
                  "linear-gradient(180deg, var(--cyan) 0%, var(--purple) 60%, transparent 100%)",
                opacity: 0.4,
              }}
            />

            {d.education.map((edu, i) => (
              <MotionReveal key={`${edu.degree}-${edu.institution}-${i}`} delay={i * 0.1}>
                <div className="relative flex gap-6 pb-10 md:ml-12">
                  {/* Timeline dot */}
                  <div
                    className="absolute -left-[2.95rem] top-1.5 hidden h-3 w-3 rounded-full md:block"
                    style={{
                      background: "var(--gradient-brand)",
                      boxShadow: "0 0 12px rgba(0,229,255,0.7)",
                    }}
                  />

                  <div
                    className="hover-card-cyan flex-1 rounded-2xl p-6"
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="hidden shrink-0 h-12 w-12 items-center justify-center rounded-xl sm:flex"
                        style={{
                          background: "rgba(0,229,255,0.1)",
                          border: "1px solid rgba(0,229,255,0.25)",
                        }}
                      >
                        <GraduationCap size={22} style={{ color: "var(--cyan)" }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h2
                              className="text-xl font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {edu.degree}
                            </h2>
                            {edu.field && (
                              <p className="mt-0.5 text-sm" style={{ color: "var(--purple-light)" }}>
                                {edu.field}
                              </p>
                            )}
                            <p className="mt-1 font-semibold" style={{ color: "var(--cyan)" }}>
                              {edu.institution}
                            </p>
                          </div>
                          <div className="flex flex-col items-start gap-1 sm:items-end">
                            {(edu.start_year || edu.end_year) && (
                              <span
                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                                style={{
                                  background: "rgba(0,229,255,0.1)",
                                  border: "1px solid rgba(0,229,255,0.3)",
                                  color: "var(--cyan)",
                                }}
                              >
                                {edu.start_year} — {edu.end_year ?? "Present"}
                              </span>
                            )}
                            {edu.grade && (
                              <span
                                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                                style={{
                                  background: "rgba(124,58,237,0.1)",
                                  border: "1px solid rgba(124,58,237,0.3)",
                                  color: "var(--purple-light)",
                                }}
                              >
                                {edu.grade}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        {edu.description && (
                          <p
                            className="mt-4 text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {edu.description}
                          </p>
                        )}

                        {/* Achievements */}
                        {edu.achievements && edu.achievements.length > 0 && (
                          <div className="mt-5">
                            <p
                              className="mb-3 text-xs font-bold uppercase tracking-wider"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Achievements
                            </p>
                            <ul className="space-y-2">
                              {edu.achievements.map((item, ai) => (
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
