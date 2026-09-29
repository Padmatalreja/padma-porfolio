/**
 * ProseContent — safely renders HTML from TipTap rich text fields.
 * Uses dangerouslySetInnerHTML only for server-rendered, admin-authored content
 * that is already sanitised server-side before storage.
 *
 * Scoped Tailwind-style prose classes keep the existing dark design consistent.
 */

function looksLikeHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

export function ProseContent({
  html,
  className = "",
}: {
  html: string | null | undefined;
  className?: string;
}) {
  if (!html) return null;

  // Plain text (no HTML tags) — render as paragraphs split on newlines
  if (!looksLikeHtml(html)) {
    return (
      <div className={className}>
        {html.split("\n").map((para, i) =>
          para.trim() ? (
            <p key={i} className="mb-3 last:mb-0 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {para}
            </p>
          ) : null
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={`prose-output ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <style>{`
        .prose-output { color: var(--text-secondary); line-height: 1.7; }
        .prose-output h2 { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); margin: 1.2em 0 0.4em; }
        .prose-output h3 { font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 1em 0 0.35em; }
        .prose-output p  { margin: 0 0 0.75em; }
        .prose-output ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0 0.75em; }
        .prose-output ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0 0.75em; }
        .prose-output li { margin: 0.25em 0; }
        .prose-output blockquote { border-left: 3px solid var(--purple-mid); padding-left: 0.9em; color: var(--text-muted); font-style: italic; margin: 0.75em 0; }
        .prose-output code { background: rgba(124,58,237,0.12); border-radius: 4px; padding: 0.1em 0.35em; font-size: 0.875em; color: var(--purple-light); }
        .prose-output a { color: var(--cyan); text-decoration: underline; }
        .prose-output strong { font-weight: 700; color: var(--text-primary); }
        .prose-output em { font-style: italic; }
        .prose-output hr { border: none; border-top: 1px solid var(--border); margin: 1em 0; }
      `}</style>
    </>
  );
}
