import type { Metadata } from "next";
import Image from "next/image";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { MotionReveal } from "@/components/public/motion-reveal";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/certifications");
  return {
    title: meta?.meta_title ?? "Certifications",
    description: meta?.meta_description ?? "Professional certifications and continuous learning.",
    alternates: { canonical: "/certifications" },
  };
}

export default async function CertificationsPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/certifications"] ?? null;
  const subheading = meta?.subheading ?? "Professional development and continuous learning.";

  return (
    <>
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
            top: "-60px", right: "20%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Credentials</p>
            <h1 className="text-4xl font-black sm:text-5xl" style={{ color: "var(--text-primary)" }}>
              Certifications &amp; <span className="gradient-text">Courses</span>
            </h1>
            <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 lg:px-8">
        {d.certifications.length === 0 ? (
          <div className="rounded-2xl p-12 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text-muted)" }}>No certifications listed yet.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {d.certifications.map((cert, i) => (
              <MotionReveal key={`${cert.name}-${i}`} delay={i * 0.07}>
                <div
                  className="hover-card flex gap-5 rounded-2xl p-6"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                >
                  <div className="shrink-0">
                    {cert.certificate_image_url ? (
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl" style={{ border: "1px solid var(--border)" }}>
                        <Image
                          src={cert.certificate_image_url}
                          alt={cert.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          loading="lazy"
                          unoptimized={cert.certificate_image_url.startsWith("/uploads/")}
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl"
                        style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)" }}>
                        <Award size={24} style={{ color: "var(--purple-light)" }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>{cert.name}</h2>
                    {cert.organization && (
                      <p className="mt-0.5 text-sm font-semibold" style={{ color: "var(--purple-light)" }}>{cert.organization}</p>
                    )}
                    {cert.issue_date && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        <Calendar size={12} />{formatDate(cert.issue_date)}
                      </p>
                    )}
                    {cert.description && (
                      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{cert.description}</p>
                    )}
                    {cert.credential_url && (
                      <a href={cert.credential_url} target="_blank" rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: "var(--cyan)" }}>
                        <ExternalLink size={12} />View Credential
                      </a>
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
