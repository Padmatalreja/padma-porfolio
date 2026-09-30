import { Search, Mail, MailOpen } from "lucide-react";
import { query } from "@/lib/db";
import { setMessageStatus } from "@/app/admin/(protected)/actions";
import { DeleteMessageBtn } from "@/components/admin/delete-message-btn";

export const dynamic = "force-dynamic";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; open?: string }>;
}) {
  const sp = await searchParams;

  // Build query with optional filters
  let queryStr = `SELECT * FROM contact_messages`;
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (sp.status === "read" || sp.status === "unread") {
    params.push(sp.status);
    conditions.push(`status = $${params.length}`);
  }
  if (sp.q) {
    const safe = `%${sp.q.replace(/[%_]/g, "")}%`;
    params.push(safe);
    const idx = params.length;
    conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR subject ILIKE $${idx})`);
  }
  if (conditions.length) queryStr += ` WHERE ${conditions.join(" AND ")}`;
  queryStr += ` ORDER BY created_at DESC`;

  const messages = (await query(queryStr, params)) as any[];

  let selected: any = null;
  if (sp.open) {
    selected =
      messages.find((m) => m.id === sp.open) ||
      (await query(`SELECT * FROM contact_messages WHERE id = $1`, [sp.open]))[0] ||
      null;
  }

  const inputStyle: React.CSSProperties = {
    padding: "0.6rem 0.875rem",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: "0.75rem",
    color: "var(--text-primary)",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <p className="eyebrow mb-2">Inbox</p>
        <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          Contact Messages
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {messages.length} total · {messages.filter((m) => m.status === "unread").length} unread
        </p>
      </div>

      {/* Filters */}
      <form className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={16}
            style={{ color: "var(--text-muted)" }}
          />
          <input
            name="q"
            defaultValue={sp.q}
            placeholder="Search name, email, subject…"
            style={{ ...inputStyle, paddingLeft: "2.5rem", width: "100%" }}
          />
        </div>
        <select name="status" defaultValue={sp.status || "all"} style={inputStyle}>
          <option value="all">All messages</option>
          <option value="unread">Unread only</option>
          <option value="read">Read only</option>
        </select>
        <button
          type="submit"
          className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-all"
          style={{
            background: "rgba(201,168,118,0.1)",
            border: "1px solid rgba(201,168,118,0.28)",
            color: "var(--tan-dark)",
          }}
        >
          Filter
        </button>
      </form>

      {/* Two-panel layout */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr]">
        {/* Message list */}
        <div className="space-y-2">
          {messages.map((m) => {
            const isOpen = sp.open === m.id;
            const params = new URLSearchParams({
              ...(sp.q ? { q: sp.q } : {}),
              ...(sp.status ? { status: sp.status } : {}),
              open: m.id,
            });
            return (
              <a
                key={m.id}
                href={`/admin/messages?${params.toString()}`}
                className="block rounded-2xl p-4 transition-all duration-200"
                style={{
                  background: isOpen ? "rgba(201,168,118,0.1)" : "var(--bg-card)",
                  border: isOpen ? "1px solid rgba(201,168,118,0.35)" : "1px solid var(--border)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    {m.status === "unread" ? (
                      <Mail size={14} style={{ color: "var(--tan-dark)", flexShrink: 0 }} />
                    ) : (
                      <MailOpen size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                    )}
                    <p className="truncate text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                      {m.subject}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold"
                    style={
                      m.status === "unread"
                        ? { background: "rgba(201,168,118,0.12)", border: "1px solid rgba(201,168,118,0.3)", color: "var(--tan-dark)" }
                        : { background: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-muted)" }
                    }
                  >
                    {m.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs" style={{ color: "var(--text-muted)" }}>
                  {m.name} · {m.email}
                </p>
                <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  {m.message}
                </p>
                <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(m.created_at).toLocaleDateString()}
                </p>
              </a>
            );
          })}
          {messages.length === 0 && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <Mail size={28} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>No messages found.</p>
            </div>
          )}
        </div>

        {/* Message detail */}
        <div>
          {selected ? (
            <div
              className="rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div
                className="flex flex-wrap items-start justify-between gap-4 p-6"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {selected.subject}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: "var(--purple-light)" }}>{selected.name}</p>
                  <a
                    href={`mailto:${selected.email}`}
                    className="text-sm transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {selected.email}
                  </a>
                  <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(selected.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={setMessageStatus.bind(null, selected.id, selected.status === "read" ? "unread" : "read")}>
                    <button
                      className="rounded-xl px-3 py-2 text-xs font-semibold transition-all"
                      style={{
                        background: "rgba(201,168,118,0.1)",
                        border: "1px solid rgba(201,168,118,0.25)",
                        color: "var(--purple-light)",
                      }}
                    >
                      Mark {selected.status === "read" ? "unread" : "read"}
                    </button>
                  </form>
                  <DeleteMessageBtn id={selected.id} />
                </div>
              </div>
              <div
                className="whitespace-pre-wrap p-6 text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {selected.message}
              </div>
            </div>
          ) : (
            <div
              className="flex h-64 items-center justify-center rounded-2xl"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            >
              <div className="text-center">
                <Mail size={32} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Select a message to read it
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
