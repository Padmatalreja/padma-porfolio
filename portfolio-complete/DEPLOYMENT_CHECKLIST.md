# Deployment Checklist

## Local Development Setup

- [ ] Copy `.env.example` → `.env.local` and fill in your values
- [ ] Run `npm install`
- [ ] Run `npm run dev` → visit `http://localhost:3000`
- [ ] Log in at `/admin/login` with `LOCAL_ADMIN_EMAIL` / `LOCAL_ADMIN_PASSWORD`

## Neon Database Setup

- [ ] Create a free project at [neon.tech](https://neon.tech)
- [ ] In the Neon dashboard go to **SQL Editor** and run the schema script:
  - `scripts/neon-schema.sql` — creates all tables and indexes
- [ ] Copy the **pooled** connection string from **Project → Connection Details → Pooled connection**
- [ ] Paste it as `DATABASE_URL` in `.env.local` (local) and in Vercel dashboard (production)

## Pre-Deploy Verification

- [ ] `npm run build` succeeds locally with all 5 env vars set
- [ ] All public routes load: `/`, `/about`, `/skills`, `/services`, `/experience`, `/education`, `/projects`, `/contact`, `/certifications`, `/awards`
- [ ] Admin routes redirect to `/admin/login` when unauthenticated
- [ ] Contact form submits and stores message in Neon DB
- [ ] Admin login works with `LOCAL_ADMIN_EMAIL` / `LOCAL_ADMIN_PASSWORD`
- [ ] Profile and section edits reflect on the public site immediately

## Vercel Deployment

- [ ] Push repository to GitHub (`.env.local` is in `.gitignore` ✅)
- [ ] Import repository at [vercel.com/new](https://vercel.com/new)
  - Root Directory: `portfolio-complete`
  - Framework Preset: **Next.js** (auto-detected)
- [ ] Add all 5 environment variables in the Vercel dashboard under **Settings → Environment Variables**:

  | Key | Value |
  |-----|-------|
  | `NEXT_PUBLIC_SITE_URL` | `https://padma-porfolio.vercel.app` (or your custom domain) |
  | `DATABASE_URL` | Your Neon pooled connection string |
  | `CONTACT_RATE_LIMIT_SALT` | A random 32-char string |
  | `LOCAL_ADMIN_EMAIL` | Your admin email |
  | `LOCAL_ADMIN_PASSWORD` | Your admin password |

- [ ] Set environment to **All Environments** (Production + Preview + Development)
- [ ] Click **Deploy**

## Post-Deploy

- [ ] Test admin login at `https://your-domain.vercel.app/admin/login`
- [ ] Verify contact form stores messages (check `/admin/messages`)
- [ ] Check `/sitemap.xml` and `/robots.txt` are accessible
- [ ] Test on mobile (375 px) and desktop (1440 px)
- [ ] If using a custom domain: add it in **Vercel → Domains** and update `NEXT_PUBLIC_SITE_URL`
