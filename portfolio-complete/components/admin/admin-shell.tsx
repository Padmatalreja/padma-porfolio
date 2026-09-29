"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Award, BookOpen, BriefcaseBusiness, ChevronLeft, ChevronRight,
  FileText, FolderKanban, GraduationCap, LayoutDashboard, Link2,
  Mail, Menu, Settings, Shapes, UserRound, X, Image as ImageIcon,
  Star, Wrench, ExternalLink, LogOut, Phone,
} from "lucide-react";
import { logoutAction } from "@/app/admin/(protected)/actions";

// ── Nav items ──────────────────────────────────────────────────────────────
const navItems = [
  { href: "/admin/dashboard",        label: "Dashboard",        Icon: LayoutDashboard,  group: "" },
  { href: "/admin/profile",          label: "Profile",          Icon: UserRound,         group: "Content" },
  { href: "/admin/experience",       label: "Experience",       Icon: BriefcaseBusiness, group: "Content" },
  { href: "/admin/education",        label: "Education",        Icon: GraduationCap,     group: "Content" },
  { href: "/admin/skill-categories", label: "Skill Categories", Icon: Shapes,            group: "Content" },
  { href: "/admin/skills",           label: "Skills",           Icon: Shapes,            group: "Content" },
  { href: "/admin/services",         label: "Services",         Icon: Wrench,            group: "Content" },
  { href: "/admin/projects",         label: "Projects",         Icon: FolderKanban,      group: "Content" },
  { href: "/admin/publications",     label: "Publications",     Icon: BookOpen,          group: "Content" },
  { href: "/admin/certifications",   label: "Certifications",   Icon: FileText,          group: "Content" },
  { href: "/admin/awards",           label: "Awards",           Icon: Award,             group: "Content" },
  { href: "/admin/testimonials",     label: "Testimonials",     Icon: Star,              group: "Content" },
  { href: "/admin/social-links",     label: "Social Links",     Icon: Link2,             group: "Content" },
  { href: "/admin/contact-info",     label: "Contact Info",     Icon: Phone,             group: "Content" },
  { href: "/admin/messages",         label: "Messages",         Icon: Mail,              group: "System" },
  { href: "/admin/media",            label: "Media",            Icon: ImageIcon,         group: "System" },
  { href: "/admin/settings",         label: "SEO / Settings",   Icon: Settings,          group: "System" },
];

// ── Espresso palette — used ONLY on sidebar + top bar ─────────────────────
const ESP = {
  sidebar:      "#231510",
  sidebarBorder:"rgba(201,168,118,0.18)",
  topbar:       "#1E1208",
  topbarBorder: "rgba(201,168,118,0.18)",
  tan:          "#C9A876",
  textPrimary:  "#F5EFE6",
  textMuted:    "rgba(201,168,118,0.5)",
  activeBg:     "rgba(201,168,118,0.15)",
  activeBorder: "rgba(201,168,118,0.35)",
  borderMid:    "rgba(201,168,118,0.28)",
} as const;

// ── Sidebar footer ─────────────────────────────────────────────────────────
function SidebarFooter({
  compact,
  email,
  profileImage,
  profileName,
}: {
  compact: boolean;
  email?: string;
  profileImage?: string | null;
  profileName?: string | null;
}) {
  const initials = profileName
    ? profileName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "A";

  return (
    <div className="p-3" style={{ borderTop: `1px solid ${ESP.sidebarBorder}` }}>
      {!compact && (
        <div
          className="mb-2 flex items-center gap-2.5 rounded-xl px-3 py-2"
          style={{ background: "rgba(201,168,118,0.08)", border: `1px solid ${ESP.sidebarBorder}` }}
        >
          {profileImage ? (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full"
              style={{ border: `1.5px solid ${ESP.borderMid}` }}>
              <Image src={profileImage} alt={profileName ?? "Profile"} fill sizes="32px"
                className="object-cover object-top"
                unoptimized={profileImage.startsWith("/uploads/")} />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
              style={{ background: "rgba(201,168,118,0.2)", color: ESP.tan, border: `1.5px solid ${ESP.borderMid}` }}>
              {initials}
            </div>
          )}
          <div className="min-w-0">
            {profileName && (
              <p className="truncate text-xs font-semibold" style={{ color: ESP.tan }}>
                {profileName}
              </p>
            )}
            {email && (
              <p className="truncate text-xs" style={{ color: ESP.textMuted }}>
                {email}
              </p>
            )}
          </div>
        </div>
      )}
      <form action={logoutAction}>
        <button
          type="submit"
          title="Sign out"
          className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-150"
          style={{ background: "rgba(184,92,74,0.12)", border: "1px solid rgba(184,92,74,0.28)", color: "#C97060" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(184,92,74,0.22)";
            el.style.borderColor = "rgba(184,92,74,0.45)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = "rgba(184,92,74,0.12)";
            el.style.borderColor = "rgba(184,92,74,0.28)";
          }}
        >
          <LogOut size={15} />
          {!compact && "Sign out"}
        </button>
      </form>
    </div>
  );
}

// ── NavItems renderer (shared between desktop + mobile) ───────────────────
function NavItems({
  compact,
  pathname,
  onNavigate,
}: {
  compact: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  let lastGroup = "__none__";
  return (
    <>
      {navItems.map((item) => {
        const showHeader = !compact && item.group && item.group !== lastGroup;
        if (item.group !== lastGroup) lastGroup = item.group;
        const active = pathname === item.href;
        return (
          <div key={item.href}>
            {showHeader && (
              <p className="mt-4 mb-1 px-3 text-xs font-bold uppercase tracking-widest"
                style={{ color: ESP.textMuted }}>
                {item.group}
              </p>
            )}
            <Link
              href={item.href}
              title={compact ? item.label : undefined}
              onClick={onNavigate}
              className="mb-0.5 flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
              style={active
                ? { background: ESP.activeBg, border: `1px solid ${ESP.activeBorder}`, color: ESP.tan }
                : { border: "1px solid transparent", color: ESP.textMuted }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "rgba(201,168,118,0.08)";
                  el.style.color = ESP.textPrimary;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.color = ESP.textMuted;
                }
              }}
            >
              <item.Icon size={17} className={compact ? "mx-auto" : "mr-2.5 shrink-0"} />
              {!compact && <span>{item.label}</span>}
            </Link>
          </div>
        );
      })}
    </>
  );
}

// ── Main shell ─────────────────────────────────────────────────────────────
export function AdminShell({
  children,
  email,
  profileImage,
  profileName,
}: {
  children: React.ReactNode;
  email?: string;
  profileImage?: string | null;
  profileName?: string | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact]       = useState(false);
  const pathname = usePathname();
  const sidebarW = compact ? 72 : 260;

  const initials = profileName
    ? profileName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "A";

  // Shared logo content for sidebar header
  const SidebarLogo = ({ onClick }: { onClick?: () => void }) => (
    <Link
      href="/admin/dashboard"
      onClick={onClick}
      className="flex items-center gap-2.5 font-black leading-none"
    >
      {profileImage ? (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full"
          style={{ border: `1.5px solid ${ESP.borderMid}` }}>
          <Image src={profileImage} alt="Profile" fill sizes="32px"
            className="object-cover object-top" unoptimized={profileImage.startsWith("/uploads/")} />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: "rgba(201,168,118,0.2)", color: ESP.tan, border: `1.5px solid ${ESP.borderMid}` }}>
          {initials}
        </div>
      )}
      {!compact && (
        <div>
          <span style={{ color: ESP.tan, fontFamily: "var(--font-display)" }}>Portfolio</span>{" "}
          <span className="text-xs font-medium" style={{ color: ESP.textMuted }}>Admin</span>
        </div>
      )}
    </Link>
  );

  return (
    // Root div — LIGHT site theme; only sidebar + topbar are dark espresso
    <div className="min-h-screen" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* ── Desktop sidebar — ESPRESSO DARK ──────────────────────── */}
      <div
        className="fixed inset-y-0 left-0 z-40 hidden flex-col lg:flex"
        style={{
          width: `${sidebarW}px`,
          background: ESP.sidebar,
          borderRight: `1px solid ${ESP.sidebarBorder}`,
          transition: "width 0.25s",
          color: ESP.textPrimary,
        }}
      >
        {/* Logo bar */}
        <div className="flex h-16 items-center px-4"
          style={{ borderBottom: `1px solid ${ESP.sidebarBorder}`, flexShrink: 0 }}>
          {compact ? (
            <Link href="/admin/dashboard" className="mx-auto">
              {profileImage ? (
                <div className="relative h-8 w-8 overflow-hidden rounded-full"
                  style={{ border: `1.5px solid ${ESP.borderMid}` }}>
                  <Image src={profileImage} alt="Profile" fill sizes="32px"
                    className="object-cover object-top" unoptimized={profileImage.startsWith("/uploads/")} />
                </div>
              ) : (
                <span style={{ color: ESP.tan, fontSize: "1.2rem", fontWeight: 900 }}>P</span>
              )}
            </Link>
          ) : (
            <SidebarLogo />
          )}
          <button
            className="ml-auto rounded-lg p-1.5 transition-colors"
            style={{ color: ESP.textMuted }}
            onClick={() => setCompact(!compact)}
            aria-label="Toggle sidebar"
          >
            {compact ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Admin navigation">
          <NavItems compact={compact} pathname={pathname} />
        </nav>

        <SidebarFooter compact={compact} email={email} profileImage={profileImage} profileName={profileName} />
      </div>

      {/* ── Mobile overlay — ESPRESSO DARK ───────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="flex h-full w-64 flex-col"
            style={{ background: ESP.sidebar, borderRight: `1px solid ${ESP.sidebarBorder}`, color: ESP.textPrimary }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-16 items-center justify-between px-4"
              style={{ borderBottom: `1px solid ${ESP.sidebarBorder}`, flexShrink: 0 }}>
              <SidebarLogo onClick={() => setMobileOpen(false)} />
              <button onClick={() => setMobileOpen(false)} style={{ color: ESP.textMuted }} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Mobile admin navigation">
              <NavItems compact={false} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </nav>
            <SidebarFooter compact={false} email={email} profileImage={profileImage} profileName={profileName} />
          </div>
        </div>
      )}

      {/* ── Main content — LIGHT ──────────────────────────────────── */}
      <div className="flex min-h-screen flex-col" style={{ marginLeft: 0 }}>
        <div className="fixed inset-y-0 left-0 hidden lg:block"
          style={{ width: `${sidebarW}px`, transition: "width 0.25s", pointerEvents: "none" }} />

        {/* Top bar — ESPRESSO DARK */}
        <header
          className="sticky top-0 z-30 flex h-16 items-center justify-between px-5 lg:px-8"
          style={{
            background: ESP.topbar,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: `1px solid ${ESP.topbarBorder}`,
            color: ESP.textPrimary,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl p-2 lg:hidden"
              style={{ color: ESP.textMuted }}
              aria-label="Open sidebar"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span className="hidden text-sm lg:block" style={{ color: ESP.textMuted }}>Admin Panel</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
              style={{ border: `1px solid ${ESP.sidebarBorder}`, color: ESP.textMuted }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = ESP.borderMid;
                el.style.color = ESP.tan;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = ESP.sidebarBorder;
                el.style.color = ESP.textMuted;
              }}
            >
              <ExternalLink size={12} />
              <span className="hidden sm:inline">View site</span>
            </a>

            {/* Profile avatar */}
            {profileImage ? (
              <div
                className="relative h-8 w-8 overflow-hidden rounded-full"
                style={{ border: `1.5px solid ${ESP.borderMid}` }}
                title={profileName ?? email}
              >
                <Image src={profileImage} alt={profileName ?? "Profile"} fill sizes="32px"
                  className="object-cover object-top"
                  unoptimized={profileImage.startsWith("/uploads/")} />
              </div>
            ) : (
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "rgba(201,168,118,0.2)", color: ESP.tan, border: `1.5px solid ${ESP.borderMid}` }}
                title={email}
              >
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Page body — uses existing LIGHT site CSS variables unchanged */}
        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>

      {/* Sidebar width offset for desktop */}
      <style>{`
        @media (min-width: 1024px) {
          header.sticky, main {
            margin-left: ${sidebarW}px;
            transition: margin-left 0.25s;
          }
        }
      `}</style>
    </div>
  );
}
