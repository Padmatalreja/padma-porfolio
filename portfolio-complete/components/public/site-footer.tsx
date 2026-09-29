import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import type { SocialLink, ContactInfo } from "@/types/portfolio";

export type FooterLink = { href: string; label: string };

const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/experience", label: "Experience" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter({
  name,
  text,
  tagline,
  socialLinks = [],
  footerLinks,
  contactInfo,
}: {
  name: string;
  text?: string | null;
  tagline?: string | null;
  socialLinks?: SocialLink[];
  footerLinks?: FooterLink[];
  contactInfo?: ContactInfo;
}) {
  const year = new Date().getFullYear();
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const links =
    footerLinks && footerLinks.length > 0 ? footerLinks : DEFAULT_FOOTER_LINKS;

  // Prefer contactInfo fields; fall back gracefully
  const email   = contactInfo?.email   ?? null;
  const phone   = contactInfo?.phone   ?? null;
  const address = contactInfo?.address ?? null;
  // Social links: prefer contactInfo's list, fall back to socialLinks prop
  const displaySocialLinks =
    contactInfo?.social_links && contactInfo.social_links.length > 0
      ? contactInfo.social_links
      : socialLinks;

  const hasContactDetails = email || phone || address;

  return (
    <footer
      className="relative mt-24 overflow-hidden"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4 opacity-40"
        style={{ background: "var(--gradient-brand)" }}
      />

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="gradient-text text-2xl font-black">{initials}</span>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {tagline || text || "Building reliable software through systematic testing."}
            </p>
            {displaySocialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {displaySocialLinks.map((link) => (
                  <a
                    key={`${link.platform}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    title={link.platform}
                    className="social-icon-btn flex h-9 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold"
                    style={{
                      background: "var(--bg-elevated)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Nav links */}
          <div>
            <p
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              Navigation
            </p>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <p
              className="mb-4 text-xs font-bold uppercase tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              More
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="footer-link flex items-center gap-1.5 text-sm"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          {hasContactDetails && (
            <div>
              <p
                className="mb-4 text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                Contact
              </p>
              <ul className="space-y-3">
                {email && (
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="footer-link flex items-start gap-2 text-sm"
                    >
                      <Mail size={14} className="mt-0.5 shrink-0" style={{ color: "var(--magenta)" }} />
                      <span className="break-all">{email}</span>
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone}`}
                      className="footer-link flex items-center gap-2 text-sm"
                    >
                      <Phone size={14} className="shrink-0" style={{ color: "var(--cyan)" }} />
                      {phone}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "var(--purple-light)" }} />
                    <span className="whitespace-pre-line">{address}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 pt-8 text-xs sm:flex-row"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <p>
            &copy; {year} {name}. All rights reserved.
          </p>
          {text && <p className="text-center">{text}</p>}
        </div>
      </div>
    </footer>
  );
}
