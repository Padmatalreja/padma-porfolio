-- ══════════════════════════════════════════════════════════════════════════════
-- Migration 004 — Add nav_links / footer_links to site_settings,
--                 add page_meta table, add contact_info table.
--
-- Run this once if you already have a deployed database from the original schema.
-- Safe to re-run (all statements are idempotent).
-- ══════════════════════════════════════════════════════════════════════════════

-- ── Add nav_links + footer_links to site_settings ────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_settings' AND column_name = 'nav_links'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN nav_links jsonb NOT NULL DEFAULT '[]';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'site_settings' AND column_name = 'footer_links'
  ) THEN
    ALTER TABLE public.site_settings ADD COLUMN footer_links jsonb NOT NULL DEFAULT '[]';
  END IF;
END $$;

-- ── page_meta ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.page_meta (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  meta_title       text,
  meta_description text,
  heading          text,
  subheading       text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_meta_slug ON public.page_meta (slug);

-- ── contact_info ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_info (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          text,
  email          text,
  address        text,
  business_hours text,
  social_links   jsonb NOT NULL DEFAULT '[]',
  is_public      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ── updated_at triggers ───────────────────────────────────────────────────────
DO $$ DECLARE t text; BEGIN
  FOREACH t IN ARRAY ARRAY['page_meta', 'contact_info'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON public.%I', t);
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t
    );
  END LOOP;
END $$;
