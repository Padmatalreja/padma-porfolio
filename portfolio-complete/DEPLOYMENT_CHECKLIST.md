# Deployment Checklist

## Local Development Setup

- [ ] Copy `.env.example` → `.env.local` and fill in your values
- [ ] Run `npm install`
- [ ] Run `npm run dev` → visit `http://localhost:3000`
- [ ] Log in at `/admin/login` with `LOCAL_ADMIN_EMAIL` / `LOCAL_ADMIN_PASSWORD`

## Supabase Setup (for full dynamic content)

- [ ] Create a free project at [supabase.com](https://supabase.com)
- [ ] Open the SQL Editor and run **in order**:
  1. `supabase/migrations/001_initial.sql`
  2. `supabase/migrations/002_services_testimonials.sql`
  3. `supabase/seed.sql` (loads Padma's CV data + 6 services)
- [ ] Create an Auth user: `Authentication → Users → Invite`
- [ ] Insert that user's UUID into `public.admin_users`:
  ```sql
  insert into public.admin_users (user_id)
  values ('<your-auth-user-uuid>');
  ```
- [ ] Copy keys into `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL` — Project URL
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — anon/public key
  - `SUPABASE_SERVICE_ROLE_KEY` — service_role key (Settings → API)
- [ ] Restart dev server: `npm run dev`
- [ ] Log in at `/admin/login` with your Supabase user credentials
- [ ] Upload profile image and CV at `/admin/profile`

## Pre-Deploy Verification

- [ ] `npm run build` succeeds locally
- [ ] All public routes return 200: `/`, `/about`, `/skills`, `/services`, `/experience`, `/education`, `/projects`, `/contact`, `/certifications`, `/awards`
- [ ] Admin routes redirect to login when unauthenticated
- [ ] Contact form submits successfully
- [ ] Profile updates reflect on the public site immediately
- [ ] Project CRUD works (add, edit, delete, reorder, mark featured)
- [ ] Media upload works (profile image, project images, CV PDF)

## Vercel Deployment

- [ ] Push repository to GitHub (ensure `.env.local` is in `.gitignore` ✅)
- [ ] Import repository in [Vercel](https://vercel.com)
- [ ] Add environment variables in Vercel dashboard:
  - `NEXT_PUBLIC_SITE_URL` = `https://yourdomain.com`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `CONTACT_RATE_LIMIT_SALT` (generate a random string)
- [ ] Deploy and run smoke tests on production URL
- [ ] Update Supabase Auth **Site URL** to your production domain
- [ ] Add custom domain and update `NEXT_PUBLIC_SITE_URL`

## Post-Deploy

- [ ] Test admin login on production
- [ ] Verify contact form stores messages in Supabase
- [ ] Check `/sitemap.xml` and `/robots.txt` are accessible
- [ ] Confirm profile image, project thumbnails, and CV download work
- [ ] Test on mobile (375px) and desktop (1440px)
