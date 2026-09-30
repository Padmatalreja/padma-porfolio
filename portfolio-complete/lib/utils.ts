export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format a date value for display (e.g. "Dec 2024").
 *
 * BUG FIX: dates stored as "YYYY-MM-DD" ISO strings represent UTC midnight.
 * Passing them directly to `new Date()` then formatting with Intl.DateTimeFormat
 * (which defaults to the local timezone) shifts the value backwards in
 * UTC-behind timezones — "2024-12-01" becomes "Nov 2024" in UTC-5.
 *
 * Fix: parse the year and month components directly from the string so the
 * displayed value always matches what was stored, regardless of the server or
 * browser timezone.
 */
export function formatDate(value?: string | null): string {
  if (!value) return "Present";

  // Handle plain YYYY-MM-DD or YYYY-MM — extract components without timezone shift
  const isoMatch = /^(\d{4})-(\d{2})(?:-\d{2})?$/.exec(value);
  if (isoMatch) {
    const year  = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10) - 1; // 0-indexed for Date constructor
    // Use UTC-based Date to avoid any local-timezone offset
    const date  = new Date(Date.UTC(year, month, 1));
    return new Intl.DateTimeFormat("en", {
      month:    "short",
      year:     "numeric",
      timeZone: "UTC",
    }).format(date);
  }

  // Fallback for full ISO timestamps or other formats
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month:    "short",
    year:     "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
