# Padma Kumari Talreja — Production Portfolio

A production-oriented personal portfolio and content-management system built with **Next.js 16.3.3 (App Router)**, React, TypeScript, Tailwind CSS, Supabase PostgreSQL/Auth/Storage, Zod, React Hook Form, Lucide icons, and Framer Motion. It is designed for Vercel's serverless architecture and does not require Express.

The initial content in `supabase/seed.sql` is derived from the supplied CV. Sections not supported by the CV (for example publications and awards) are intentionally empty until the administrator adds content.

## Features

- Responsive public portfolio: home, about, experience, education, skills, projects, publications, certifications, awards, contact.
- Project detail routes at `/projects/[slug]` and publication filtering by year/type.
- Supabase email/password admin authentication with server-side authorization checks.
- Protected admin dashboard with statistics, recent content, quick actions, responsive sidebar, and logout.
- CRUD management for profile, experience, education, skill categories, skills, projects, publications, certifications, awards, social links, and settings.
- Ordering controls for ordered content, featured project/publication flags, project gallery uploads, and CV/profile/certificate/award uploads.
- Searchable contact inbox with read/unread and delete controls.
- Supabase Storage media manager with upload, preview, replace, and delete.
- MIME/size validation (images up to 6 MB; resume PDF up to 10 MB).
- Contact form with React Hook Form, Zod validation, server-side validation, honeypot spam defense, hashed-IP rate limiting (5/hour), and safe error responses.
- RLS, storage policies, database constraints, indexes, server-only service role use, security response headers, sitemap, robots, canonical metadata, Open Graph/Twitter defaults, and JSON-LD (`Person`, `ProfilePage`, and `ScholarlyArticle` when publications exist).
- CV-derived fallback data allows the public site to render before Supabase environment variables are configured.

## Requirements

- Node.js 20.9+ (Node 22 recommended)
- npm
- Supabase project
- Vercel account for deployment

## 1. Install

```bash
npm install
```

## 2. Configure environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Configure:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
CONTACT_RATE_LIMIT_SALT=YOUR_LONG_RANDOM_SECRET
```

`SUPABASE_SERVICE_ROLE_KEY` and `CONTACT_RATE_LIMIT_SALT` are server-only. **Never** prefix them with `NEXT_PUBLIC_` and never expose them to browser code.

Supabase now labels the browser-safe key as a **Publishable key**. Obtain the Project URL and Publishable key from the Supabase project's Connect/API settings. The service role key is only used inside server-only code after administrator authorization or by the contact ingestion route.

## 3. Create the Supabase schema

In Supabase Dashboard → **SQL Editor**:

1. Open `supabase/migrations/001_initial.sql`.
2. Paste the entire file into a new SQL query.
3. Run it once.

The migration creates:

- `admin_users`
- `profiles`
- `experiences`
- `education`
- `skill_categories`
- `skills`
- `projects`
- `project_images`
- `publications`
- `certifications`
- `awards`
- `social_links`
- `contact_messages`
- `contact_rate_limits`
- `site_settings`
- `media`
- storage buckets: `profile-images`, `project-images`, `certificates`, `resume`
- indexes, constraints, `updated_at` triggers, RLS policies, storage policies, and the atomic `submit_contact_message` rate-limited function.

## 4. Seed the CV data

In the SQL Editor, run the complete `supabase/seed.sql` file after the migration.

The seed is deterministic and re-runnable. It creates the CV-backed profile, HABIBMETRO experience, BS Computer Science education, categorized skills, DVAGO testing project, and listed certifications/activities. It intentionally does not invent missing publications, awards, profile photo, GitHub URL, LinkedIn URL, ORCID, ResearchGate, or Google Scholar profile.

## 5. Create the administrator

The application assumes one administrator initially.

1. In Supabase Dashboard → **Authentication → Users**, choose **Add user**.
2. Enter the administrator email and a strong password. Create/confirm the user.
3. Copy the user's UUID from Authentication → Users.
4. In SQL Editor run:

```sql
insert into public.admin_users (user_id)
values ('PASTE_AUTH_USER_UUID_HERE')
on conflict (user_id) do nothing;
```

5. Start the application and visit:

```text
http://localhost:3000/admin/login
```

Only an authenticated user whose UUID exists in `public.admin_users` can enter the protected admin area. The root `proxy.ts` refreshes the Supabase cookie session and redirects unauthenticated admin traffic, while the protected server layout independently checks administrator membership before rendering.

## 6. Upload the current CV

The CV's text is seeded, but the seed SQL cannot upload a local PDF into your remote Supabase Storage project. After logging into the admin dashboard:

1. Go to **Admin → Profile**.
2. Choose the CV/resume PDF in the CV field.
3. Save.

The PDF is uploaded to the `resume` bucket and the public **Download CV** button appears automatically. Future replacements stay in Supabase Storage; Vercel's ephemeral local filesystem is not used for persistent uploads.

## 7. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

Production-mode validation:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## Admin routes

```text
/admin/login
/admin/dashboard
/admin/profile
/admin/experience
/admin/education
/admin/skill-categories
/admin/skills
/admin/projects
/admin/publications
/admin/certifications
/admin/awards
/admin/social-links
/admin/messages
/admin/media
/admin/settings
```

The dynamic admin content route is intentionally configuration-driven so all of these URLs share the same hardened CRUD implementation instead of duplicating database logic.

## Security design

- Authentication uses Supabase email/password with cookie-based SSR sessions.
- Protected server layouts verify both the Supabase user and `admin_users` membership.
- Admin mutations call `requireAdmin()` before using the server-only service role client.
- All public database content has RLS enabled. Anonymous users can read only rows marked `is_public`.
- Contact messages have no public read policy; contact ingestion occurs through a validated server route.
- Contact rate limiting hashes the request IP with `CONTACT_RATE_LIMIT_SALT`; raw IP addresses are not stored.
- Rate limiting and message insertion occur inside a PostgreSQL function.
- Uploads validate MIME type and size on the server and again through bucket MIME/file-size constraints.
- No service role key appears in client modules.
- Next.js/React provide output escaping; user text is rendered as text, not arbitrary HTML.
- Security headers include HSTS, `X-Content-Type-Options`, clickjacking protection, referrer policy, permissions policy, and cross-origin opener policy.

For especially high-traffic deployments, add a distributed edge rate limiter (such as Vercel Firewall/Rate Limiting or Upstash) in addition to the included PostgreSQL rate limit.

## Storage and media

Buckets are created by the migration. Public portfolio assets are readable by visitors, while database/storage writes require administrator authorization. The media manager can upload, preview, replace, and delete managed files. Project editors can upload multiple gallery images and delete individual gallery entries.

Recommended image formats: WebP/AVIF/JPEG/PNG. Resume uploads must be PDF.

## GitHub

Create a repository and push the project:

```bash
git init
git add .
git commit -m "Initial production portfolio"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

Do not commit `.env.local` or secrets. `.gitignore` already excludes environment files.

## Vercel deployment

1. Push this folder to GitHub.
2. In Vercel, choose **Add New → Project**.
3. Import the GitHub repository.
4. Vercel should detect **Next.js** automatically.
5. Keep the default build command (`next build`) and install command (`npm install`).
6. In **Project Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SITE_URL` — first use the Vercel production URL, later update it to the custom domain.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CONTACT_RATE_LIMIT_SALT`
7. Apply the variables to Production (and Preview if you want preview deployments connected to Supabase).
8. Click **Deploy**.
9. After the first deployment, verify `/`, `/contact`, `/admin/login`, and an authenticated `/admin/dashboard` session.

### Supabase Auth URL configuration

For password-only sign-in, no OAuth callback is required. In Supabase Authentication → URL Configuration, set the Site URL to your production domain. If you later add magic links/OAuth, add the appropriate Vercel preview and production callback URLs before enabling those providers.

## Custom domain

1. Vercel → Project → **Settings → Domains**.
2. Add your domain.
3. Follow Vercel's DNS instructions.
4. Change `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com` in Vercel.
5. Redeploy so canonical URLs, sitemap entries, and JSON-LD use the custom domain.
6. Update the Supabase Auth Site URL to the same production domain.

## Production troubleshooting

**Public site works, admin login says Supabase is not configured**  
Verify all four Supabase variables are present in the environment where the app runs, then restart/redeploy.

**Login succeeds but redirects back to login**  
Confirm the authenticated user's UUID exists in `public.admin_users` and that the migration/RLS policies ran successfully.

**Uploads fail**  
Confirm the migration created all four buckets. Check file MIME/size limits. Verify `SUPABASE_SERVICE_ROLE_KEY` exists only on the server environment.

**Contact form returns 503**  
The server-side service role configuration is missing. Add `SUPABASE_SERVICE_ROLE_KEY` and redeploy.

**Images from Supabase fail in Next Image**  
The included `next.config.ts` allows HTTPS images from `*.supabase.co`. If you use a custom storage CDN hostname, add that hostname to `images.remotePatterns`.

**Canonical/sitemap URLs show localhost**  
Set `NEXT_PUBLIC_SITE_URL` in Vercel to the production HTTPS domain and redeploy.

## Data privacy

The original CV included a more specific Karachi locality. The public seed uses **Karachi, Pakistan** rather than a more precise residential/locality-style address. Private references and government identifiers are not stored. Review the public email/phone fields before launch if you prefer not to display them publicly.

## Project structure

```text
app/
  (public)/
  admin/
  api/contact/
  layout.tsx
  sitemap.ts
  robots.ts
components/
  public/
  admin/
  ui/
lib/
  supabase/
  validations/
  admin-config.ts
  auth.ts
  data.ts
  fallback-data.ts
types/
supabase/
  migrations/001_initial.sql
  seed.sql
.env.example
proxy.ts
next.config.ts
package.json
README.md
vercel.json
```
