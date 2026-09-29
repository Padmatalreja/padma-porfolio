import type { Metadata } from "next";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { PublicationsClient } from "./publications-client";
import { JsonLd } from "@/components/public/json-ld";
import { MotionReveal } from "@/components/public/motion-reveal";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/publications");
  return {
    title: meta?.meta_title ?? "Publications",
    description: meta?.meta_description ?? "Research publications and academic work.",
    alternates: { canonical: "/publications" },
  };
}

export default async function PublicationsPage() {
  const d = await getPortfolioData();

  const schemas = d.publications.map((p) => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: p.title,
    author: p.authors?.map((name) => ({ "@type": "Person", name })),
    datePublished: p.year ? String(p.year) : undefined,
    isPartOf: p.journal ? { "@type": "Periodical", name: p.journal } : undefined,
    sameAs: p.url || undefined,
    identifier: p.doi || undefined,
  }));

  return (
    <>
      <JsonLd data={schemas} />

      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "400px",
            height: "400px",
            background: "radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)",
            top: "-60px",
            right: "20%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Research</p>
            <h1 className="text-4xl font-black sm:text-5xl" style={{ color: "var(--text-primary)" }}>
              Publications &amp; <span className="gradient-text">Research</span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              {d.publications.length > 0
                ? `${d.publications.length} academic and professional publication${d.publications.length !== 1 ? "s" : ""}.`
                : "Publications will appear here when added via the admin panel."}
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        {d.publications.length > 0 ? (
          <PublicationsClient items={d.publications} />
        ) : (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>No publications listed yet.</p>
          </div>
        )}
      </section>
    </>
  );
}
