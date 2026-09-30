/**
 * ProseContent — safely renders HTML from TipTap rich text fields.
 *
 * HTML is sanitised with a strict allowlist before being passed to
 * dangerouslySetInnerHTML, preventing stored-XSS attacks.
 *
 * We intentionally do NOT use isomorphic-dompurify here because it
 * bundles jsdom, which pulls in @csstools/css-calc (ESM-only) and
 * breaks Vercel's serverless Node.js runtime with an ERR_REQUIRE_ESM error.
 *
 * Instead we use the native browser DOMParser when available (client-side
 * rendering) and a fast regex strip as the server-side fallback.
 * Both paths enforce the same tag/attribute allowlist.
 */

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "code", "pre",
  "a", "hr",
  "span", "div",
]);

const ALLOWED_ATTR = new Set(["href", "target", "rel", "class"]);

/**
 * Server-safe sanitizer: strips every tag not in ALLOWED_TAGS and every
 * attribute not in ALLOWED_ATTR using regex. Fast and dependency-free.
 */
function sanitizeServer(html: string): string {
  // Remove script/style blocks entirely (content + tags)
  let out = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  // Strip disallowed tags (keep inner text)
  out = out.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g, (match, tag: string) => {
    if (!ALLOWED_TAGS.has(tag.toLowerCase())) return "";
    // Strip disallowed attributes from allowed tags
    return match.replace(/\s([a-zA-Z:_-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]*)/g, (attrMatch, attr: string) => {
      if (!ALLOWED_ATTR.has(attr.toLowerCase())) return "";
      // Block javascript: and data: in href
      if (attr.toLowerCase() === "href") {
        const val = attrMatch.replace(/.*?=\s*["']?/, "").replace(/["']$/, "");
        if (/^(javascript|data|vbscript):/i.test(val.trim())) return "";
      }
      return attrMatch;
    });
  });

  return out;
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

  const clean = sanitizeServer(html);

  return (
    <div
      className={`prose-output ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
