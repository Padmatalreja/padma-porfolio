import type { Metadata } from "next";
import { Mail, Phone, MapPin, Send, Clock, Globe } from "lucide-react";
import { getPortfolioData, getPageMeta } from "@/lib/data";
import { ContactForm } from "@/components/public/contact-form";
import { MotionReveal } from "@/components/public/motion-reveal";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("/contact");
  return {
    title: meta?.meta_title ?? "Contact",
    description: meta?.meta_description ?? "Get in touch.",
    alternates: { canonical: "/contact" },
  };
}

function PlatformIcon({ platform }: { platform: string }) {
  return <Globe size={16} />;
}

export default async function ContactPage() {
  const d = await getPortfolioData();
  const meta = d.pageMeta?.["/contact"] ?? null;
  const subheading =
    meta?.subheading ??
    "Have a project in mind or just want to say hello? Send a message and I'll get back to you.";

  // Prefer dedicated contact_info; fall back to profile fields
  const ci = d.contactInfo;
  const phone         = ci?.phone    ?? d.profile.phone    ?? null;
  const email         = ci?.email    ?? d.profile.email    ?? null;
  const address       = ci?.address  ?? d.profile.location ?? null;
  const businessHours = ci?.business_hours ?? null;
  // Merge: contact_info social links override; fall back to social_links table
  const socialLinks =
    ci?.social_links && ci.social_links.length > 0
      ? ci.social_links
      : d.socialLinks;

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div
          className="glow-orb"
          style={{
            width: "450px",
            height: "450px",
            background: "radial-gradient(circle, rgba(255,0,212,0.12) 0%, transparent 70%)",
            top: "-80px",
            left: "10%",
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 lg:px-8">
          <MotionReveal>
            <p className="eyebrow mb-3">Contact</p>
            <h1
              className="text-4xl font-black sm:text-5xl lg:text-6xl"
              style={{ color: "var(--text-primary)" }}
            >
              Let&apos;s{" "}
              <span className="gradient-text">Connect</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg" style={{ color: "var(--text-secondary)" }}>
              {subheading}
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* Two-panel layout */}
      <section className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-start">
          {/* Left — contact details */}
          <MotionReveal delay={0.1}>
            <div className="space-y-5">
              {/* Email */}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="contact-card contact-card-magenta flex items-center gap-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(255,0,212,0.1)",
                      border: "1px solid rgba(255,0,212,0.25)",
                    }}
                  >
                    <Mail size={20} style={{ color: "var(--magenta)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Email
                    </p>
                    <p className="mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>
                      {email}
                    </p>
                  </div>
                </a>
              )}

              {/* Phone */}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="contact-card contact-card-cyan flex items-center gap-4"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(0,229,255,0.1)",
                      border: "1px solid rgba(0,229,255,0.25)",
                    }}
                  >
                    <Phone size={20} style={{ color: "var(--cyan)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Phone
                    </p>
                    <p className="mt-0.5 font-medium" style={{ color: "var(--text-primary)" }}>
                      {phone}
                    </p>
                  </div>
                </a>
              )}

              {/* Address */}
              {address && (
                <div
                  className="flex items-center gap-4 rounded-2xl p-5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(201,168,118,0.1)",
                      border: "1px solid rgba(201,168,118,0.25)",
                    }}
                  >
                    <MapPin size={20} style={{ color: "var(--purple-light)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Address
                    </p>
                    <p className="mt-0.5 font-medium whitespace-pre-line" style={{ color: "var(--text-primary)" }}>
                      {address}
                    </p>
                  </div>
                </div>
              )}

              {/* Business Hours */}
              {businessHours && (
                <div
                  className="flex items-start gap-4 rounded-2xl p-5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "rgba(0,229,255,0.08)",
                      border: "1px solid rgba(0,229,255,0.2)",
                    }}
                  >
                    <Clock size={20} style={{ color: "var(--cyan)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Business Hours
                    </p>
                    <p className="mt-0.5 font-medium whitespace-pre-line" style={{ color: "var(--text-primary)" }}>
                      {businessHours}
                    </p>
                  </div>
                </div>
              )}

              {/* Social links */}
              {socialLinks.length > 0 && (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Social
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={`${link.platform}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="social-icon-btn flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold"
                      >
                        <PlatformIcon platform={link.platform} />
                        {link.platform}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </MotionReveal>

          {/* Right — contact form */}
          <MotionReveal delay={0.15}>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: "var(--gradient-brand)",
                  }}
                >
                  <Send size={18} color="#fff" />
                </div>
                <div>
                  <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>
                    Send a Message
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {meta?.heading ?? "Usually responds within 24 hours"}
                  </p>
                </div>
              </div>
              <ContactForm />
            </div>
          </MotionReveal>
        </div>
      </section>
    </>
  );
}
