/**
 * ProseContent — safely renders HTML from TipTap rich text fields.
 *
 * All HTML is sanitised with DOMPurify (isomorphic-dompurify) before being
 * passed to dangerouslySetInnerHTML, preventing stored-XSS attacks even if
 * malicious content were somehow saved to the database.
 *
 * Allowed elements are restricted to safe formatting tags only.
 */
import DOMPurify from "isomorphic-dompurify";

/** Allowed HTML tags for richtext output — no script/style/iframe. */
const ALLOWED_TAGS = [
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "hr",
  "span", "div",
];

const ALLOWED_ATTR = ["href", "target", "rel", "class", "style"];

function sanitize(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Force all links to open in a new tab safely
    ADD_ATTR: ["target"],
    FORCE_BODY: false,
  });
}

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
            <p
              key={i}
              className="mb-3 last:mb-0 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {para}
            </p>
          ) : null
        )}
      </div>
    );
  }

  const clean = sanitize(html);

  return (
    <div
      className={`prose-output ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );

}
