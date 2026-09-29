import type { Metadata } from "next";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { getPortfolioData } from "@/lib/data";
import { siteUrl } from "@/lib/env";

// Always fetch fresh so admin changes to nav/footer/name reflect immediately.
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPortfolioData();
  return {
    title: {
      default: data.settings.site_title,
      template: `%s | ${data.profile.full_name}`,
    },
    description: data.settings.meta_description,
    keywords: data.settings.seo_keywords,
    openGraph: {
      type: "website",
      url: siteUrl,
      title: data.settings.site_title,
      description: data.settings.meta_description,
      siteName: data.settings.site_title,
    },
    twitter: {
      card: "summary_large_image",
      title: data.settings.site_title,
      description: data.settings.meta_description,
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getPortfolioData();

  return (
    <>
      <SiteHeader
        logo={data.settings.logo_text}
        navLinks={data.settings.nav_links ?? []}
        profileImage={data.profile.profile_image_url}
        profileName={data.profile.full_name}
      />
      <main className="page-enter">{children}</main>
      <SiteFooter
        name={data.profile.full_name}
        text={data.settings.footer_text}
        tagline={data.profile.short_intro}
        socialLinks={data.socialLinks}
        footerLinks={data.settings.footer_links ?? []}
        contactInfo={data.contactInfo}
      />
    </>
  );
}
