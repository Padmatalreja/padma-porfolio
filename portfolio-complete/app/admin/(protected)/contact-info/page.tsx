import { query } from "@/lib/db";
import { saveContactInfo } from "@/app/admin/(protected)/actions";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Always fetch fresh data — never serve a cached version of this page
export const dynamic = "force-dynamic";

export default async function ContactInfoAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const sp = await searchParams;

  // Auto-create table if migration hasn't been run yet
  await query(
    `CREATE TABLE IF NOT EXISTS contact_info (
      id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      phone          text,
      email          text,
      address        text,
      business_hours text,
      social_links   jsonb NOT NULL DEFAULT '[]',
      is_public      boolean NOT NULL DEFAULT true,
      created_at     timestamptz NOT NULL DEFAULT now(),
      updated_at     timestamptz NOT NULL DEFAULT now()
    )`,
    []
  ).catch(() => {});

  const rows = await query(`SELECT * FROM contact_info LIMIT 1`, []).catch(() => []);
  const row = (rows[0] as any) ?? {};

  // Convert JSONB social_links → "Platform | url" textarea value
  const socialLinks: Array<{ platform: string; url: string }> = Array.isArray(row.social_links)
    ? row.social_links
    : [];
  const socialLinksText = socialLinks.map((l) => `${l.platform} | ${l.url}`).join("\n");

  const saved = sp.saved === "1";

  const inputStyle =
    "w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all focus:ring-2 focus:ring-purple-500/30";
  const labelStyle = "block mb-1.5 text-sm font-semibold";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="eyebrow mb-2">Content Management</p>
        <h1 className="text-3xl font-black" style={{ color: "var(--text-primary)" }}>
          Contact Info
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
          Editing this once updates the contact page, footer, and everywhere else on the site.
        </p>
      </div>

      {saved && (
        <div
          className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold"
          style={{
            background: "var(--success-bg)",
            border: "1px solid var(--success-border)",
            color: "var(--success)",
          }}
        >
          <CheckCircle2 size={17} />
          Contact info saved successfully.
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <form action={saveContactInfo} className="space-y-6">
            {/* Phone */}
            <div>
              <label htmlFor="ci-phone" className={labelStyle} style={{ color: "var(--text-secondary)" }}>
                Phone
              </label>
              <input
                id="ci-phone"
                name="phone"
                type="text"
                defaultValue={row.phone ?? ""}
                placeholder="+1 234 567 8900"
                className={inputStyle}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="ci-email" className={labelStyle} style={{ color: "var(--text-secondary)" }}>
                Email
              </label>
              <input
                id="ci-email"
                name="email"
                type="email"
                defaultValue={row.email ?? ""}
                placeholder="hello@example.com"
                className={inputStyle}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="ci-address" className={labelStyle} style={{ color: "var(--text-secondary)" }}>
                Address
              </label>
              <textarea
                id="ci-address"
                name="address"
                rows={3}
                defaultValue={row.address ?? ""}
                placeholder="123 Main St, City, Country"
                className={inputStyle}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Business Hours */}
            <div>
              <label htmlFor="ci-hours" className={labelStyle} style={{ color: "var(--text-secondary)" }}>
                Business Hours
              </label>
              <textarea
                id="ci-hours"
                name="business_hours"
                rows={3}
                defaultValue={row.business_hours ?? ""}
                placeholder={"Mon–Fri: 9 AM – 6 PM\nSat: 10 AM – 2 PM"}
                className={inputStyle}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Social Links */}
            <div>
              <label htmlFor="ci-social" className={labelStyle} style={{ color: "var(--text-secondary)" }}>
                Social Links
                <span className="ml-2 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  one per line — Platform | URL
                </span>
              </label>
              <textarea
                id="ci-social"
                name="social_links_text"
                rows={5}
                defaultValue={socialLinksText}
                placeholder={"LinkedIn | https://linkedin.com/in/yourprofile\nGitHub | https://github.com/yourprofile\nTwitter | https://twitter.com/yourhandle"}
                className={inputStyle}
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                  resize: "vertical",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.82rem",
                }}
              />
              <p className="mt-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                Lines with invalid URLs are silently skipped.
              </p>
            </div>

            {/* is_public checkbox */}
            <div className="flex items-center gap-3">
              <input
                id="ci-public"
                name="is_public"
                type="checkbox"
                defaultChecked={row.is_public !== false}
                className="h-4 w-4 rounded accent-purple-500"
              />
              <label htmlFor="ci-public" className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                Public (show on site)
              </label>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="gradient">
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
