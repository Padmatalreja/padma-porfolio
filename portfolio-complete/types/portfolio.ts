export type Profile = {
  id?: string;
  full_name: string;
  professional_title: string;
  short_intro: string;
  biography: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  profile_image_url?: string | null;
  hero_text?: string | null;
  availability_status?: string | null;
  resume_url?: string | null;
};

export type Experience = {
  id?: string;
  position: string;
  organization: string;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  is_current?: boolean;
  description?: string | null;
  responsibilities?: string[];
  achievements?: string[];
  display_order?: number;
};

export type Education = {
  id?: string;
  degree: string;
  institution: string;
  field?: string | null;
  start_year?: number | null;
  end_year?: number | null;
  grade?: string | null;
  description?: string | null;
  achievements?: string[];
  display_order?: number;
};

export type SkillCategory = {
  id?: string;
  name: string;
  display_order?: number;
  skills?: Array<{ id?: string; name: string; display_order?: number }>;
};

export type Project = {
  id?: string;
  title: string;
  slug: string;
  description?: string | null;
  full_description?: string | null;
  technologies?: string[];
  category?: string | null;
  role?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  thumbnail_url?: string | null;
  featured?: boolean;
  display_order?: number;
  images?: string[];
};

export type Publication = {
  id?: string;
  title: string;
  authors?: string[];
  journal?: string | null;
  conference?: string | null;
  year?: number | null;
  volume?: string | null;
  issue?: string | null;
  pages?: string | null;
  doi?: string | null;
  url?: string | null;
  abstract?: string | null;
  publication_type?: string | null;
  featured?: boolean;
};

export type Certification = {
  id?: string;
  name: string;
  organization?: string | null;
  issue_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  certificate_image_url?: string | null;
  description?: string | null;
  display_order?: number;
};

export type Award = {
  id?: string;
  title: string;
  organization?: string | null;
  award_date?: string | null;
  description?: string | null;
  image_url?: string | null;
  display_order?: number;
};

export type SocialLink = {
  id?: string;
  platform: string;
  url: string;
  display_order?: number;
};

export type SiteSettings = {
  site_title: string;
  meta_description: string;
  logo_text?: string | null;
  footer_text?: string | null;
  seo_keywords?: string[];
  hero_text?: string | null;
  availability_status?: string | null;
  nav_links?: Array<{ href: string; label: string }>;
  footer_links?: Array<{ href: string; label: string }>;
};

export type Service = {
  id?: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  display_order?: number;
  is_public?: boolean;
};

export type Testimonial = {
  id?: string;
  author_name: string;
  author_title?: string | null;
  company?: string | null;
  content: string;
  rating?: number | null;
  avatar_url?: string | null;
  display_order?: number;
  is_public?: boolean;
};

export type PageMeta = {
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  heading?: string | null;
  subheading?: string | null;
};

export type NavLink = {
  href: string;
  label: string;
};

export type ContactInfo = {
  id?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  business_hours?: string | null;
  social_links?: Array<{ platform: string; url: string }>;
  is_public?: boolean;
};

export type PortfolioData = {
  profile: Profile;
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  projects: Project[];
  publications: Publication[];
  certifications: Certification[];
  awards: Award[];
  socialLinks: SocialLink[];
  settings: SiteSettings & { nav_links?: NavLink[]; footer_links?: NavLink[] };
  services: Service[];
  testimonials: Testimonial[];
  pageMeta?: Record<string, PageMeta>;
  contactInfo?: ContactInfo;
};
