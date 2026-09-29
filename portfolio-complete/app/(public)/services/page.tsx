import type { Metadata } from "next";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/services");
  return {
    title: meta?.meta_title ?? "Services",
    description:
      meta?.meta_description ??
      "Professional QA and software testing services delivered with precision and care.",
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  const d = await getPortfolioData();
  const services = d.services || [];
  const meta = d.pageMeta?.["/services"] ?? null;
  const subheading =
    meta?.subheading ??
    "Professional QA and software testing services delivered with precision and care.";

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(255,0,212,0.14) 0%, transparent 70%)",
            top: "-80px",
            right: "-60px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">What I Do</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              My <span className="gradient-text">Services</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Services grid */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        {services.length === 0 ? (
          <div
            className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>No services listed yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc, i) => (
              <MotionReveal key={(svc as any).id || i} delay={i * 0.07}>
                <div
                  className="hover-card-lift group flex h-full flex-col rounded-2xl p-7"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  {(svc as any).icon && (
                    <div
                      className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.25)",
                      }}
                    >
                      {(svc as any).icon}
                    </div>
                  )}
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {svc.title}
                  </h2>
                  {svc.description && (
                    <p
                      className="mt-3 flex-1 text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {svc.description}
                    </p>
                  )}
                  <div
                    className="mt-6 h-px w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ background: "var(--gradient-brand)" }}
                  />
                </div>
              </MotionReveal>
            ))}
          </div>
        )}

        {/* CTA — text from page_meta or sensible default */}
        <MotionReveal delay={0.3}>
          <div
            className="relative mt-16 overflow-hidden rounded-2xl p-10 text-center"
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(124,58,237,0.4) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10">
              <h2 className="text-2xl font-black sm:text-3xl" style={{ color: "var(--text-primary)" }}>
                Ready to work together?
              </h2>
              <p className="mx-auto mt-3 max-w-md" style={{ color: "var(--text-secondary)" }}>
                Let&apos;s discuss how I can help improve your software quality.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/contact" className="btn-primary">
                  Get in Touch
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
