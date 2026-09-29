import type { Metadata } from "next";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/skills");
  return {
    title: meta?.meta_title ?? "Skills",
    description: meta?.meta_description ?? "Technical skills and tools.",
    alternates: { canonical: "/skills" },
  };
}

export default async function SkillsPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/skills"] ?? null;
  const totalSkills = d.skillCategories.reduce((n, c) => n + (c.skills?.length || 0), 0);

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)",
            top: "-60px",
            right: "10%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Capabilities</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Skills &amp;{" "}
              <span className="gradient-text">Tools</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {totalSkills} technical capabilities across {d.skillCategories.length} domains.
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {d.skillCategories.map((cat, i) => (
            <MotionReveal key={cat.name} delay={i * 0.07}>
              <div
                className="skill-cat-card rounded-2xl p-6"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="h-1.5 w-8 rounded-full"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                  <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {cat.name}
                  </h2>
                  <span className="ml-auto text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                    {cat.skills?.length || 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills?.map((skill) => (
                    <span key={skill.name} className="skill-chip">{skill.name}</span>
                  ))}
                </div>
              </div>
            </MotionReveal>
          ))}
        </div>

        {d.skillCategories.length === 0 && (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>No skills listed yet.</p>
          </div>
        )}
      </section>
    </>
  );
}
