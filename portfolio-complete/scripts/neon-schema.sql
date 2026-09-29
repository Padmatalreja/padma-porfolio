-- ══════════════════════════════════════════════════════════════════════════════
-- Neon PostgreSQL Schema for Padma Kumari Talreja Portfolio
-- Run this once against your Neon database to create all tables.
-- No Supabase-specific features (auth.users, RLS, storage) are used.
-- ══════════════════════════════════════════════════════════════════════════════

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ── Core tables ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name        text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 150),
  professional_title text NOT NULL DEFAULT '',
  short_intro      text NOT NULL DEFAULT '',
  biography        text NOT NULL DEFAULT '',
  email            text NOT NULL DEFAULT '',
  phone            text,
  location         text,
  profile_image_url text,
  hero_text        text,
  availability_status text,
  resume_url       text,
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 1,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_title       text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  hero_text        text,
  logo_text        text,
  footer_text      text,
  seo_keywords     text[] NOT NULL DEFAULT '{}',
  availability_status text,
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 1,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position         text NOT NULL,
  organization     text NOT NULL,
  location         text,
  start_date       date,
  end_date         date,
  is_current       boolean NOT NULL DEFAULT false,
  description      text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  achievements     text[] NOT NULL DEFAULT '{}',
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CHECK (is_current OR end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS public.education (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree           text NOT NULL,
  institution      text NOT NULL,
  field            text,
  start_year       integer CHECK (start_year BETWEEN 1900 AND 2200),
  end_year         integer CHECK (end_year BETWEEN 1900 AND 2200),
  grade            text,
  description      text,
  achievements     text[] NOT NULL DEFAULT '{}',
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skill_categories (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL UNIQUE,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   uuid NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name          text NOT NULL,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, name)
);

CREATE TABLE IF NOT EXISTS public.projects (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  slug             text NOT NULL UNIQUE,
  thumbnail_url    text,
  description      text,
  full_description text,
  technologies     text[] NOT NULL DEFAULT '{}',
  category         text,
  role             text,
  start_date       date,
  end_date         date,
  github_url       text,
  live_url         text,
  featured         boolean NOT NULL DEFAULT false,
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_images (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url     text NOT NULL,
  alt_text      text,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.publications (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text NOT NULL,
  authors          text[] NOT NULL DEFAULT '{}',
  journal          text,
  conference       text,
  year             integer CHECK (year BETWEEN 1800 AND 2200),
  volume           text,
  issue            text,
  pages            text,
  doi              text,
  url              text,
  abstract         text,
  publication_type text,
  featured         boolean NOT NULL DEFAULT false,
  is_public        boolean NOT NULL DEFAULT true,
  display_order    integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL,
  organization          text,
  issue_date            date,
  credential_id         text,
  credential_url        text,
  certificate_image_url text,
  description           text,
  is_public             boolean NOT NULL DEFAULT true,
  display_order         integer NOT NULL DEFAULT 0,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.awards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  organization  text,
  award_date    date,
  description   text,
  image_url     text,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      text NOT NULL,
  url           text NOT NULL,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 150),
  description   text,
  icon          text,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name   text NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 120),
  author_title  text,
  company       text,
  content       text NOT NULL CHECK (char_length(content) BETWEEN 5 AND 2000),
  rating        integer CHECK (rating BETWEEN 1 AND 5),
  avatar_url    text,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL CHECK (char_length(name) BETWEEN 2 AND 100),
  email      text NOT NULL CHECK (char_length(email) <= 200),
  subject    text NOT NULL CHECK (char_length(subject) BETWEEN 2 AND 160),
  message    text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  status     text NOT NULL DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  ip_hash          text PRIMARY KEY,
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count    integer NOT NULL DEFAULT 0,
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.media (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket        text NOT NULL,
  path          text,
  file_name     text NOT NULL,
  mime_type     text,
  size_bytes    bigint,
  url           text,
  is_public     boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_experiences_order     ON public.experiences(display_order);
CREATE INDEX IF NOT EXISTS idx_education_order       ON public.education(display_order);
CREATE INDEX IF NOT EXISTS idx_skills_category_order ON public.skills(category_id, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured     ON public.projects(featured, display_order);
CREATE INDEX IF NOT EXISTS idx_project_images_proj   ON public.project_images(project_id, display_order);
CREATE INDEX IF NOT EXISTS idx_publications_year     ON public.publications(year DESC, publication_type);
CREATE INDEX IF NOT EXISTS idx_contact_status        ON public.contact_messages(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_bucket          ON public.media(bucket, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_order        ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_order    ON public.testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category     ON public.projects(category);

-- ── updated_at triggers ───────────────────────────────────────────────────────

DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles','site_settings','experiences','education','skill_categories','skills',
    'projects','project_images','publications','certifications','awards','social_links',
    'services','testimonials','contact_messages','contact_rate_limits','media'
  ] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t
    );
  END LOOP;
END $$;
