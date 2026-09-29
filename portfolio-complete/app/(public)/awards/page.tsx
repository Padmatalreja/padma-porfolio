import type { Metadata } from "next";
import Image from "next/image";
import { Trophy, Calendar } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/awards");
  return {
    title: meta?.meta_title ?? "Awards",
    description: meta?.meta_description ?? "Awards and achievements.",
    alternates: { canonical: "/awards" },
  };
}

export default async function AwardsPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/awards"] ?? null;
  const subheading = meta?.subheading ?? "Recognition and accomplishments throughout my career.";

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="glow-orb" style={{ width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(0,229,255,0.15) 0%, transparent 70%)",
          top: "-60px", left: "20%" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Recognition</p>
            <h1 className="text-4xl font-black sm:text-5xl" style={{ color: "var(--text-primary)" }}>
              Awards &amp; <span className="gradient-text">Achievements</span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        {d.awards.length === 0 ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text-muted)" }}>No awards listed yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {d.awards.map((award, i) => (
              <MotionReveal key={`${award.title}-${i}`} delay={i * 0.07}>
                <div className="hover-card-cyan flex gap-5 rounded-2xl p-6"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  <div className="shrink-0">
                    {award.image_url ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
                        <Image
                          src={award.image_url}
                          alt={award.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                          loading="lazy"
                          unoptimized={award.image_url.startsWith("/uploads/")}
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl"
                        style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.25)" }}>
                        <Trophy size={24} style={{ color: "var(--cyan)" }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{award.title}</h2>
                    {award.organization && (
                      <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--cyan)" }}>{award.organization}</p>
                    )}
                    {award.award_date && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Calendar size={12} />{formatDate(award.award_date)}
                      </p>
                    )}
                    {award.description && (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{award.description}</p>
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
