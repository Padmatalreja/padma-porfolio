import Link from "next/link";
import {
  ArrowRight, BookOpen, BriefcaseBusiness, FolderKanban,
  GraduationCap, Mail, Shapes, Wrench, Star,
} from "lucide-react";
import { query } from "@/lib/db";
import { hasNeonEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const statItems = [
  { table: "projects",         label: "Projects",     Icon: FolderKanban,      color: "rgba(201,168,118,0.15)", border: "rgba(201,168,118,0.35)",  text: "var(--tan-dark)" },
  { table: "skills",           label: "Skills",       Icon: Shapes,            color: "rgba(92,140,138,0.12)",  border: "rgba(92,140,138,0.28)",   text: "var(--cyan)" },
  { table: "services",         label: "Services",     Icon: Wrench,            color: "rgba(168,136,79,0.12)",  border: "rgba(168,136,79,0.28)",   text: "var(--tan)" },
  { table: "experiences",      label: "Experience",   Icon: BriefcaseBusiness, color: "rgba(201,168,118,0.15)", border: "rgba(201,168,118,0.35)",  text: "var(--tan-dark)" },
  { table: "education",        label: "Education",    Icon: GraduationCap,     color: "rgba(92,140,138,0.12)",  border: "rgba(92,140,138,0.28)",   text: "var(--cyan)" },
  { table: "contact_messages", label: "Messages",     Icon: Mail,              color: "rgba(184,92,74,0.1)",    border: "rgba(184,92,74,0.25)",    text: "var(--error)" },
  { table: "testimonials",     label: "Testimonials", Icon: Star,              color: "rgba(201,168,118,0.15)", border: "rgba(201,168,118,0.35)",  text: "var(--tan-dark)" },
  { table: "publications",     label: "Publications", Icon: BookOpen,          color: "rgba(92,140,138,0.12)",  border: "rgba(92,140,138,0.28)",   text: "var(--cyan)" },
] as const;

async function ConnectedDashboard() {
  const counts = await Promise.all(
    statItems.map(async ({ table }) => {
      const rows = await query(`SELECT COUNT(*) AS c FROM "${table}"`, []).catch(() => [{ c: 0 }]);
      return Number((rows[0] as any).c);
    })
  );

  const unreadRows = await query`
    SELECT COUNT(*) AS c FROM contact_messages WHERE status = 'unread'
  `;
  const unread = Number((unreadRows[0] as any).c);

  const messages = await query`
    SELECT id, name, email, subject, status, created_at
    FROM contact_messages
    ORDER BY created_at DESC
    LIMIT 5
  `;

  const projects = await query`
    SELECT id, title, featured, created_at
    FROM projects
    ORDER BY created_at DESC
    LIMIT 5
  `;

  return (
    <>
      {/* Stat grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statItems.map(({ table, label, Icon, color, border, text }, i) => (
          <div
            key={table}
            className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{label}</p>
                <p className="mt-2 text-4xl font-black" style={{ color: "var(--text-primary)" }}>
                  {counts[i]}
                </p>
                {table === "contact_messages" && (
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {unread} unread
                  </p>
                )}
              </div>
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{ background: color, border: `1px solid ${border}` }}
              >
                <Icon size={20} style={{ color: text }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two column */}
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        {/* Recent messages */}
        <div
          className="rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div
            className="flex items-center justify-between p-5"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Recent Messages</h2>
            <Link
              href="/admin/messages"
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: "var(--tan-dark)" }}
            >
              View all <ArrowRight size={13} /></Link>
          </div>
          <div className="divide-y p-3" style={{ borderColor: "var(--border)" }}>
            {(messages as any[]).map((m) => (
              <Link
                key={m.id}
                href={`/admin/messages?open=${m.id}`}
                className="nav-link flex items-start justify-between gap-3 rounded-xl px-3 py-3 transition-all"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {m.subject}
                  </p>
                  <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
                    {m.name} · {m.email}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                  style={
                    m.status === "unread"
                      ? { background: "rgba(184,92,74,0.1)", border: "1px solid rgba(184,92,74,0.28)", color: "var(--error)" }
                      : { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }
                  }
                >
                  {m.status}
                </span>
              </Link>
            ))}
            {messages.length === 0 && (
              <p className="px-3 py-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                No messages yet.
              </p>
            )}
          </div>
        </div>

        {/* Quick actions + recent projects */}
        <div className="space-y-6">
          <div
            className="rounded-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="p-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              {[
                { href: "/admin/projects?new=1",     label: "Add Project" },
                { href: "/admin/experience?new=1",   label: "Add Experience" },
                { href: "/admin/services?new=1",     label: "Add Service" },
                { href: "/admin/media",              label: "Manage Media" },
                { href: "/admin/skills?new=1",       label: "Add Skill" },
                { href: "/admin/testimonials?new=1", label: "Add Testimonial" },
                { href: "/admin/contact-info",       label: "Edit Contact Info" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="admin-quick-action flex items-center justify-between rounded-xl px-3 py-3 text-sm font-semibold transition-all"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {label}
                  <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div
              className="flex items-center justify-between p-5"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <h2 className="font-bold" style={{ color: "var(--text-primary)" }}>Recent Projects</h2>
              <Link
                href="/admin/projects"
                className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: "var(--tan-dark)" }}
              >
                Manage <ArrowRight size={13} />
              </Link>
            </div>
            <div className="divide-y p-3" style={{ borderColor: "var(--border)" }}>
              {(projects as any[]).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </p>
                  {p.featured && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                      style={{
                        background: "rgba(201,168,118,0.12)",
                        border: "1px solid rgba(201,168,118,0.3)",
                        color: "var(--tan-dark)",
                      }}
                    >
                      Featured
                    </span>
                  )}
                </div>
              ))}
              {projects.length === 0 && (
                <p className="px-3 py-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No projects yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function OfflineDashboard() {
  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
    >
      <p className="font-bold" style={{ color: "var(--text-primary)" }}>
        DATABASE_URL is not configured
      </p>
      <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
        Add your Neon{" "}
        <code
          className="rounded px-1 py-0.5 text-xs"
          style={{ background: "var(--bg-elevated)", color: "var(--cyan)" }}
        >
          DATABASE_URL
        </code>{" "}
        to{" "}
        <code
          className="rounded px-1 py-0.5 text-xs"
          style={{ background: "var(--bg-elevated)", color: "var(--cyan)" }}
        >
          .env.local
        </code>{" "}
        and restart the dev server.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {([["/" , "View public site"], ["/admin/profile", "Edit profile"]] as const).map(([href, label]) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {label} <ArrowRight size={15} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="eyebrow mb-2">Overview</p>
        <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>Dashboard</h1>
        <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
          Manage all portfolio content from one place.
        </p>
      </div>
      {hasNeonEnv() ? <ConnectedDashboard /> : <OfflineDashboard />}
    </div>
  );
}
