import type { Metadata } from "next";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import { ProjectsClient } from "./projects-client";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/projects");
  return {
    title: meta?.meta_title ?? "Projects",
    description: meta?.meta_description ?? "Portfolio of QA and software testing projects.",
    alternates: { canonical: "/projects" },
  };
}

export default async function ProjectsPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/projects"] ?? null;
  const subheading =
    meta?.subheading ??
    `${d.projects.length} documented project${d.projects.length !== 1 ? "s" : ""} spanning testing, automation, and software quality assurance.`;

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(201,168,118,0.18) 0%, transparent 70%)",
            top: "-80px",
            right: "-60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Portfolio</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <ProjectsClient projects={d.projects} />
      </section>
    </>
  );
}
