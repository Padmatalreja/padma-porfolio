import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { getPortfolioData } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const d = await getPortfolioData();

  const staticRoutes = [
    "",
    "/about",
    "/skills",
    "/services",
    "/experience",
    "/education",
    "/projects",
    "/contact",
    // Conditionally include if content exists
    ...(d.publications.length > 0 ? ["/publications"] : []),
    ...(d.certifications.length > 0 ? ["/certifications"] : []),
    ...(d.awards.length > 0 ? ["/awards"] : []),
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...d.projects.map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.9 : 0.7,
    })),
  ];
}
