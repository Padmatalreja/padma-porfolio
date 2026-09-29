/**
 * Migration 003:
 *  - page_meta table (per-page SEO: title, description, heading, subtitle)
 *  - status column on projects, services (draft | published)
 *  - nav_links + footer_links columns on site_settings (JSON arrays)
 *
 * Run: node scripts/migrate-003.mjs
 */
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_V4LijBMD8RfN@ep-billowing-sunset-b5faxsh2-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

const client = await pool.connect();

try {
  await client.query(`
    -- page_meta: per-page SEO + hero text overrides
    CREATE TABLE IF NOT EXISTS public.page_meta (
      slug             text PRIMARY KEY,
      meta_title       text,
      meta_description text,
      heading          text,
      subheading       text,
      updated_at       timestamptz NOT NULL DEFAULT now()
    );

    -- status on projects
    ALTER TABLE public.projects
      ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft','published'));

    -- status on services
    ALTER TABLE public.services
      ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published'
        CHECK (status IN ('draft','published'));

    -- nav_links + footer_links on site_settings (stored as JSONB)
    ALTER TABLE public.site_settings
      ADD COLUMN IF NOT EXISTS nav_links  jsonb NOT NULL DEFAULT '[]'::jsonb;

    ALTER TABLE public.site_settings
      ADD COLUMN IF NOT EXISTS footer_links jsonb NOT NULL DEFAULT '[]'::jsonb;
  `);

  // Seed page_meta with current hardcoded headings/subtitles
  const pages = [
    {
      slug: "/",
      meta_title: "Padma Kumari Talreja | QA Engineer Portfolio",
      meta_description: "Portfolio of Padma Kumari Talreja, Technical Analyst and QA Engineer specializing in manual, automation, API, performance, and banking application testing.",
      heading: null,
      subheading: null,
    },
    {
      slug: "/about",
      meta_title: "About | Padma Kumari Talreja",
      meta_description: "Professional profile and career overview.",
      heading: "Crafting Quality, One Test at a Time",
      subheading: null,
    },
    {
      slug: "/skills",
      meta_title: "Skills & Tools | Padma Kumari Talreja",
      meta_description: "Technical skills and tools across testing, automation, programming, and methodologies.",
      heading: null,
      subheading: null,
    },
    {
      slug: "/services",
      meta_title: "Services | Padma Kumari Talreja",
      meta_description: "Professional QA and software testing services delivered with precision and care.",
      heading: null,
      subheading: "Professional QA and software testing services delivered with precision and care.",
    },
    {
      slug: "/projects",
      meta_title: "Projects | Padma Kumari Talreja",
      meta_description: "Portfolio of QA and software testing projects.",
      heading: null,
      subheading: "Documented projects spanning testing, automation, and software quality assurance.",
    },
    {
      slug: "/experience",
      meta_title: "Experience | Padma Kumari Talreja",
      meta_description: "Professional experience in software quality assurance and technical analysis.",
      heading: null,
      subheading: "Roles, responsibilities, and delivery experience across banking and technology products.",
    },
    {
      slug: "/education",
      meta_title: "Education | Padma Kumari Talreja",
      meta_description: "Academic background and qualifications.",
      heading: null,
      subheading: "Academic foundations and coursework that shaped a systems-oriented engineering mindset.",
    },
    {
      slug: "/certifications",
      meta_title: "Certifications | Padma Kumari Talreja",
      meta_description: "Professional certifications and continuous learning.",
      heading: null,
      subheading: "Professional development and continuous learning.",
    },
    {
      slug: "/awards",
      meta_title: "Awards | Padma Kumari Talreja",
      meta_description: "Awards and achievements.",
      heading: null,
      subheading: null,
    },
    {
      slug: "/publications",
      meta_title: "Publications | Padma Kumari Talreja",
      meta_description: "Research publications and academic work.",
      heading: null,
      subheading: null,
    },
    {
      slug: "/contact",
      meta_title: "Contact | Padma Kumari Talreja",
      meta_description: "Get in touch with Padma Kumari Talreja.",
      heading: null,
      subheading: "Have a project in mind or just want to say hello? Send a message and I'll get back to you.",
    },
  ];

  for (const p of pages) {
    await client.query(
      `INSERT INTO page_meta (slug, meta_title, meta_description, heading, subheading)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (slug) DO UPDATE
         SET meta_title = EXCLUDED.meta_title,
             meta_description = EXCLUDED.meta_description,
             heading = EXCLUDED.heading,
             subheading = EXCLUDED.subheading,
             updated_at = now()`,
      [p.slug, p.meta_title, p.meta_description, p.heading, p.subheading]
    );
  }

  // Seed nav_links + footer_links into the existing site_settings row
  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/education", label: "Education" },
    { href: "/contact", label: "Contact" },
    { href: "/publications", label: "Publications" },
    { href: "/certifications", label: "Certifications" },
    { href: "/awards", label: "Awards" },
  ];
  const footerLinks = [
    { href: "/about", label: "About" },
    { href: "/skills", label: "Skills" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/contact", label: "Contact" },
  ];

  await client.query(
    `UPDATE site_settings
     SET nav_links = $1::jsonb, footer_links = $2::jsonb
     WHERE id = (SELECT id FROM site_settings LIMIT 1)`,
    [JSON.stringify(navLinks), JSON.stringify(footerLinks)]
  );

  console.log("✅ Migration 003 complete");
} catch (err) {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
