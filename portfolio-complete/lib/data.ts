import { cache } from "react";
import { query } from "@/lib/db";
import { fallbackData } from "@/lib/fallback-data";
import { hasNeonEnv } from "@/lib/env";
import type { PortfolioData, Project, PageMeta, ContactInfo } from "@/types/portfolio";

// React.cache() deduplicates calls within a single server render pass.
export const getPortfolioData = cache(async function getPortfolioData(): Promise<PortfolioData> {
  if (!hasNeonEnv()) return fallbackData;

  try {
    const [
      profiles,
      settings,
      experiences,
      education,
      categories,
      skills,
      projects,
      projectImages,
      publications,
      certifications,
      awards,
      socialLinks,
      services,
      testimonials,
      pageMetas,
      contactInfoRows,
    ] = await Promise.all([
      query`SELECT * FROM profiles WHERE is_public = true LIMIT 1`,
      query`SELECT * FROM site_settings WHERE is_public = true LIMIT 1`,
      query`SELECT * FROM experiences WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM education WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM skill_categories WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM skills WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM projects WHERE is_public = true AND status = 'published' ORDER BY display_order ASC`,
      query`SELECT * FROM project_images WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM publications WHERE is_public = true`,
      query`SELECT * FROM certifications WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM awards WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM social_links WHERE is_public = true ORDER BY display_order ASC`,
      query`SELECT * FROM services WHERE is_public = true ORDER BY display_order ASC`.catch(() => []),
      query`SELECT * FROM testimonials WHERE is_public = true ORDER BY display_order ASC`.catch(() => []),
      query`SELECT * FROM page_meta`.catch(() => []),
      query`SELECT * FROM contact_info LIMIT 1`.catch(() => []),
    ]);

    const profile = profiles[0];
    if (!profile) {
      // Database is reachable but has no public profile row — this is a
      // configuration issue, not a DB failure. Log it clearly.
      console.warn(
        "[getPortfolioData] No public profile found in database. Serving fallback data."
      );
      return fallbackData;
    }

    const categoriesWithSkills = categories.map((cat: any) => ({
      ...cat,
      skills: skills.filter((s: any) => s.category_id === cat.id),
    }));

    const projectsWithImages = projects.map((project: any) => ({
      ...project,
      images: projectImages
        .filter((img: any) => img.project_id === project.id)
        .map((img: any) => img.image_url),
    }));

    const sortedPublications = [...publications].sort(
      (a: any, b: any) => (b.year || 0) - (a.year || 0)
    );

    const pageMetaMap: Record<string, PageMeta> = {};
    for (const row of pageMetas as any[]) {
      pageMetaMap[row.slug] = row as PageMeta;
    }

    const contactInfoRaw  = (contactInfoRows[0] as any) ?? null;
    const contactInfo: ContactInfo | undefined = contactInfoRaw
      ? {
          ...contactInfoRaw,
          social_links: Array.isArray(contactInfoRaw.social_links)
            ? contactInfoRaw.social_links
            : [],
        }
      : undefined;

    const settingsRow  = settings[0] as any;
    const navLinks     = Array.isArray(settingsRow?.nav_links)
      ? settingsRow.nav_links
      : typeof settingsRow?.nav_links === "string"
      ? JSON.parse(settingsRow.nav_links)
      : [];
    const footerLinks  = Array.isArray(settingsRow?.footer_links)
      ? settingsRow.footer_links
      : typeof settingsRow?.footer_links === "string"
      ? JSON.parse(settingsRow.footer_links)
      : [];

    return {
      profile,
      settings: {
        ...(settingsRow || fallbackData.settings),
        nav_links:    navLinks,
        footer_links: footerLinks,
      },
      experiences,
      education,
      skillCategories: categoriesWithSkills,
      projects: projectsWithImages,
      publications: sortedPublications,
      certifications,
      awards,
      socialLinks,
      services,
      testimonials,
      pageMeta:    pageMetaMap,
      contactInfo,
    } as PortfolioData;
  } catch (err) {
    // Log the real error so it's visible in server logs / error-tracking tools.
    // Do NOT swallow it silently — the admin/operator needs to know the DB is
    // unreachable before end-users notice degraded content.
    console.error(
      "[getPortfolioData] Database query failed — serving fallback data.",
      err instanceof Error ? err.message : err
    );
    return fallbackData;
  }
});

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const data = await getPortfolioData();
  return data.projects.find((p) => p.slug === slug) || null;
}

/** Fetch page meta for a single slug — used in per-page generateMetadata(). */
export const getPageMeta = cache(async function getPageMeta(
  slug: string
): Promise<PageMeta | null> {
  if (!hasNeonEnv()) return null;
  try {
    const rows = await query(`SELECT * FROM page_meta WHERE slug = $1 LIMIT 1`, [slug]);
    return (rows[0] as PageMeta) || null;
  } catch (err) {
    console.error(`[getPageMeta] Failed to fetch meta for slug "${slug}":`, err);
    return null;
  }
});
