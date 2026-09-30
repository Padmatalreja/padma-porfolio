# Padma Kumari Talreja — Production Portfolio

A production-grade personal portfolio and content-management system built with:

- **Next.js 16 (App Router)** — React 19, TypeScript, Tailwind CSS v4
- **Neon PostgreSQL** — serverless Postgres via `@neondatabase/serverless`
- **HMAC-SHA256 local auth** — no third-party auth service required
- **TipTap** — rich-text editor for biography, project descriptions, etc.
- **Zod + React Hook Form** — validated forms on both client and server
- **Lucide** icons, **isomorphic-dompurify** HTML sanitisation

Designed for **Vercel serverless** deployment. No Express, no Supabase.

---

## Features

- Responsive public portfolio: home, about, experience, education, skills, projects, publications, certifications, awards, services, contact.
- Project detail routes at `/projects/[slug]`.
- Publication filtering by year and type.
- Protected admin CMS dashboard with sidebar navigation.
- Config-driven CRUD for all content sections (profile, experience, education, skills, projects, publications, certifications, awards, social links, services, testimonials, settings).
- Ordering controls, featured flags, and project gallery support.
- Contact inbox with read/unread/delete controls.
- Media manager with local file upload.
- MIME/size validation — images up to 6 MB, PDFs up to 10 MB.
- Contact form with Zod validation, honeypot spam defence, and hashed-IP rate limiting (5/hour, atomic upsert).
- Login rate limiting — 5 failed attempts per 15-minute window.
- HMAC-signed session cookies — `httpOnly`, `secure` (in production), `sameSite: strict`.
- DOMPurify HTML sanitisation on all rich-text output.
- Security headers: HSTS, CSP, `X-Frame-Options`, `X-Content-Type-Options`, Referrer-Policy, Permissions-Policy, COOP.
- Sitemap, robots.txt, canonical metadata, Open Graph / Twitter cards, JSON-LD (`Person`, `ProfilePage`).
- CV-derived fallback data so the public site renders before the database is configured.
- Health check endpoint at `/api/health`.
- GitHub Actions CI — lint + typecheck + build on every push.

---

## Requirements

- Node.js ≥ 20.9 (22 recommended)
- npm
- A [Neon](https://neon.tech) PostgreSQL project (free tier is sufficient)
- Vercel account for deployment

---

## 1. Install

```bash
npm install
```

---

## 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:

```env
# Public site URL — no trailing slash
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Neon PostgreSQL connection string (from the Neon dashboard → Connect)
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require&channel_binding=require

# Random string used to salt IP hashes for contact rate-limiting
# Generate with: openssl rand -hex 32
CONTACT_RATE_LIMIT_SALT=replace-with-a-long-random-string

# Admin login credentials
# For production, replace LOCAL_ADMIN_PASSWORD with a bcrypt hash:
#   node -e "const b=require('bcryptjs'); b.hash('yourpass',12).then(console.log)"
# The login action detects a bcrypt hash (starts with $2) automatically.
LOCAL_ADMIN_EMAIL=admin@portfolio.local
LOCAL_ADMIN_PASSWORD=Admin@1234
```

> **Security note:** Never commit `.env.local` to Git. It is already in `.gitignore`.

---

## 3. Create the database schema

Run the schema script against your Neon database.

**Option A — Neon SQL Editor (recommended for first setup):**

1. Open your Neon project → **SQL Editor**.
2. Paste the contents of `scripts/neon-schema.sql` into a new query.
3. Click **Run**.

**Option B — via the run-schema script:**

```bash
npm run check:env      # verify env vars are set
node scripts/run-schema.mjs
```

The schema creates all tables including:

- `profiles`, `site_settings` (with `nav_links`, `footer_links` columns)
- `experiences`, `education`, `skill_categories`, `skills`
- `projects`, `project_images`, `publications`
- `certifications`, `awards`, `social_links`, `services`, `testimonials`
- `contact_messages`, `contact_rate_limits`
- `page_meta`, `contact_info`
- `media`
- All indexes and `updated_at` triggers

**Existing database — run the migration instead:**

If you already have a deployed database from an earlier version, run only the migration to add the missing columns and tables:

```bash
# Paste into Neon SQL Editor:
scripts/migrate-004-missing-tables.sql
```

---

## 4. Seed the CV data (optional)

The fallback data in `lib/fallback-data.ts` already contains Padma's CV content and is served automatically when the database is empty. To persist that content to the database, run the seed script:

```bash
node scripts/seed.mjs
```

---

## 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To run the admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Use the `LOCAL_ADMIN_EMAIL` and `LOCAL_ADMIN_PASSWORD` you set in `.env.local`.

**Full production-mode validation:**

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

---

## 6. Admin routes

```
/admin/login
/admin/dashboard
/admin/profile
/admin/experience
/admin/education
/admin/skill-categories
/admin/skills
/admin/services
/admin/projects
/admin/publications
/admin/certifications
/admin/awards
/admin/testimonials
/admin/social-links
/admin/contact-info
/admin/messages
/admin/media
/admin/settings
```

---

## 7. Hashing the admin password (recommended for production)

Instead of storing the plain-text password in the environment variable, store a bcrypt hash:

```bash
node -e "const b = require('bcryptjs'); b.hash('your-strong-password', 12).then(h => console.log(h))"
```

Set `LOCAL_ADMIN_PASSWORD` to the output (e.g. `$2b$12$...`). The login action detects the `$2` prefix and uses bcrypt comparison automatically.

---

## 8. Security design

- **Middleware** (`middleware.ts`) redirects unauthenticated requests to `/admin/login` before any admin page renders.
- **`requireAdmin()`** is also called inside every protected server layout and every server action, providing defence-in-depth.
- **Session cookies** are `httpOnly`, `secure` (in production), and `sameSite: strict`.
- **Session tokens** are HMAC-SHA256 signed with a cryptographically random nonce so two logins never produce the same token.
- **Login rate limiting** blocks an email after 5 failed attempts within 15 minutes.
- **HTML sanitisation** — all rich-text output is passed through DOMPurify before `dangerouslySetInnerHTML`, preventing stored XSS.
- **Path traversal** — `/api/download-cv` resolves the full path and verifies it is inside `/public/uploads/` before reading.
- **Contact rate limiting** uses an atomic `ON CONFLICT DO UPDATE` upsert to prevent race conditions.
- **IP hashing** — raw IP addresses are never stored; they are hashed with `CONTACT_RATE_LIMIT_SALT`.
- **No secrets in client code** — all sensitive env vars are server-only.
- **CSP** restricts image sources to known hostnames (Cloudinary, Unsplash). Extend `next.config.ts` `remotePatterns` and the CSP `img-src` directive if you add other image hosts.

---

## 9. Vercel deployment

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Set the **Root Directory** to `portfolio-complete` if deploying the subfolder.
4. In **Settings → Environment Variables**, add all variables from `.env.example`.
5. Click **Deploy**.

After deploying, verify:

- `/` — public home page loads with your profile data
- `/api/health` — returns `{"status":"ok"}`
- `/admin/login` — login form visible
- Authenticated `/admin/dashboard` — CMS loads correctly

**Important:** Vercel's filesystem is ephemeral. Files uploaded via `/api/upload` are stored in `/public/uploads/` and will be **lost on redeploy**. For persistent uploads, integrate Cloudinary:

- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in Vercel (stubs are in `.env.example`).
- Update `/api/upload/route.ts` to use the Cloudinary Node SDK instead of `fs/promises.writeFile`.

---

## 10. Custom domain

1. Vercel → Project → **Settings → Domains** → add your domain.
2. Update `NEXT_PUBLIC_SITE_URL` to `https://yourdomain.com` in Vercel env vars.
3. Redeploy so canonical URLs, sitemap entries, and JSON-LD use the correct domain.

---

## 11. CI/CD

A GitHub Actions workflow is included at `.github/workflows/ci.yml`. It runs lint, typecheck, and build on every push and pull request to `main`/`master`.

To enable it, add the following secrets to your GitHub repository (**Settings → Secrets → Actions**):

- `DATABASE_URL`
- `LOCAL_ADMIN_EMAIL`
- `LOCAL_ADMIN_PASSWORD`
- `CONTACT_RATE_LIMIT_SALT`

The CI uses stub values if secrets are absent, so it will still run but the build won't connect to a real database.

---

## 12. Health check

```
GET /api/health
```

Returns `200` with `{"status":"ok","database":"ok"}` when the app and database are healthy.
Returns `503` with `{"status":"degraded","database":"error"}` when the database is unreachable.

Use this URL as a Vercel deployment check or uptime monitor target.

---

## Project structure

```
portfolio-complete/
├── app/
│   ├── (public)/          Public portfolio pages
│   ├── admin/             Protected CMS panel
│   ├── api/               Route handlers (contact, upload, download-cv, health, contact-info)
│   ├── globals.css        Design tokens + utility styles
│   └── layout.tsx         Root layout (fonts, metadata base)
├── components/
│   ├── public/            SiteHeader, SiteFooter, ContactForm, ProseContent, ...
│   ├── admin/             AdminShell, AdminSection, ImageUpload, RichTextEditor, ...
│   └── ui/                Input, Textarea, Button, Card, Badge
├── lib/
│   ├── db.ts              Neon HTTP + Pool drivers (query, queryWithPool)
│   ├── auth.ts            requireAdmin() / getAdminUser()
│   ├── local-auth.ts      HMAC-SHA256 session tokens
│   ├── login-rate-limit.ts In-process login attempt counter
│   ├── data.ts            React.cache() portfolio data fetcher
│   ├── fallback-data.ts   Hardcoded CV data (served when DB absent)
│   ├── admin-config.ts    Config-driven CRUD schema
│   ├── env.ts             Environment variable helpers
│   └── validations/       Zod schemas
├── scripts/
│   ├── neon-schema.sql    Full database schema (run once on fresh DB)
│   ├── migrate-004-missing-tables.sql  Incremental migration for existing DBs
│   ├── seed.mjs           CV data seed
│   ├── check-env.mjs      Pre-build environment variable check
│   └── run-schema.mjs     Schema runner script
├── types/
│   └── portfolio.ts       TypeScript types for all data models
├── middleware.ts           Next.js middleware — admin route auth guard
├── next.config.ts          Next.js config (security headers, image patterns)
├── .env.example            Environment variable template
└── .github/workflows/ci.yml  GitHub Actions CI
```

---

## Troubleshooting

**Public site loads but shows fallback/CV data instead of database content**
Run the schema script and seed. Check that `DATABASE_URL` is set correctly and the database is reachable via `/api/health`.

**Admin login says "Admin authentication is not configured"**
Verify `LOCAL_ADMIN_EMAIL` and `LOCAL_ADMIN_PASSWORD` are set in the environment and the server has been restarted.

**Login succeeds but immediately redirects back to login**
The session cookie requires HTTPS in production (`secure: true`). Ensure you are accessing the site via HTTPS, not HTTP.

**Too many login attempts error**
Wait 15 minutes or restart the server (the rate limiter is in-process). For production with multiple instances, implement a Redis-backed rate limiter.

**Uploads disappear after redeployment**
Expected behaviour on Vercel — the local filesystem is ephemeral. Migrate to Cloudinary (see section 9).

**`/api/health` returns 503**
The database is unreachable. Check `DATABASE_URL`, Neon project status, and network connectivity.

**Canonical/sitemap URLs show localhost**
Set `NEXT_PUBLIC_SITE_URL` to your production HTTPS domain in Vercel environment variables and redeploy.
