# Trout House Kings Beach

Marketing site for the eight-unit furnished rental property at 8638 Trout Ave, Kings Beach, CA. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, **Sanity** as the CMS, and Resend for forms.

---

## Quick start (after Sanity is set up)

```bash
npm install
cp .env.example .env.local
# fill in Sanity + Resend credentials (see below)
npm run dev
```

Open http://localhost:3000 for the public site, http://localhost:3000/studio for the CMS editor.

---

## One-time Sanity setup

You only do this once. After that, all editing happens in the Studio at `/studio`.

### 1. Create a Sanity project

Go to **[sanity.io/manage](https://www.sanity.io/manage)** and create a new project.

- Pick a name (e.g. "Trout House")
- Use the default dataset name `production`
- Free tier is fine — limits are well above what this site needs

Once created, copy the **Project ID** from the project's settings page.

### 2. Create a write token (for seeding)

In the project's **API → Tokens** page, click **Add API token**:

- Name: `seed-script`
- Permissions: **Editor**
- Copy the token immediately (it's only shown once)

You can delete this token after seeding if you want — it's only needed to run the seed script.

### 3. Set environment variables

Copy `.env.example` to `.env.local`, then fill in:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<your project id>
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=<your write token>
```

### 4. Seed the dataset

This uploads existing photos and creates documents for all 8 units, site settings, and each page's content:

```bash
npm run sanity:seed
```

Takes about 1–2 minutes (mostly photo uploads). Idempotent — safe to re-run if anything goes wrong.

### 5. Add CORS origin

In Sanity manage, **API → CORS origins**, add `http://localhost:3000` (and your production URL once deployed) so the Studio can connect.

### 6. Open the Studio

```bash
npm run dev
```

Then visit **http://localhost:3000/studio**. Sign in with your Sanity account. You'll see all 8 units, page content, and site settings ready to edit.

---

## Editing content (everyday workflow)

Once seeded, **all content lives in Sanity**. Just open `/studio`, edit, and click "Publish". Changes appear on the live site within 60 seconds.

| What you want to change            | Where (in Sanity Studio)                      |
| ---------------------------------- | --------------------------------------------- |
| Unit photos, pricing, status       | Units → pick a unit                           |
| Mark a unit leased / available     | Units → pick a unit → Status field            |
| Avail application URL (per unit)   | Units → pick a unit → Links → Apply URL       |
| Site contact email/phone           | Site settings                                 |
| Airbnb listing URL                 | Site settings → External links                |
| Hero photo, headline, subhead      | Homepage → Hero                               |
| Value props on homepage            | Homepage → Value props                        |
| About copy on homepage             | Homepage → About section                      |
| Email capture title/body           | Homepage → Email capture                      |
| Walkable destinations + seasons    | Neighborhood page                             |
| FAQ on /apply                      | Apply page → FAQ                              |
| Application steps on /apply        | Apply page → Steps                            |
| Short stays page (Airbnb funnel)   | Short stays page                              |

### Adding photos

1. Open the unit (or page) in Studio
2. Drop a photo into the Photos field (or click the field and upload)
3. **Important: add alt text** — required for accessibility and SEO
4. Drag photos to reorder; the first photo is the unit's card image
5. Click **Publish**

Sanity automatically resizes and serves photos via CDN — no manual optimization needed.

### Marking a unit leased

1. Open the unit in Studio
2. Change **Status** to "Leased"
3. Publish — it'll be removed from the homepage's available list within 60s.

### Coming-soon units

1. Set **Status** to "Coming soon"
2. Set **Available date** to when it'll open
3. Publish — the unit page shows the date and a banner

---

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. In [Vercel](https://vercel.com/new), import the repo. Framework auto-detects as Next.js.
3. In **Project Settings → Environment Variables**, set:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET=production`
   - `RESEND_API_KEY`
   - `NOTIFY_EMAILS` (comma-separated recipients)
   - `NOTIFY_FROM` (e.g. `Trout House <noreply@trouthousetahoe.com>`)
   - `NEXT_PUBLIC_SITE_URL` (your production URL once domain is wired)
4. Add CORS origin in Sanity manage (your production URL).
5. Add the custom domain under **Settings → Domains**.
6. Submit `https://trouthousetahoe.com/sitemap.xml` to [Google Search Console](https://search.google.com/search-console).

Vercel Analytics ships free on Hobby — already wired in `app/(marketing)/layout.tsx`.

---

## Forms (Resend)

The contact and email-capture forms post to API routes that send via Resend.

### One-time setup

1. Sign up at [resend.com](https://resend.com).
2. Verify a sending domain (use the same domain as the site — `trouthousetahoe.com`).
3. Create an API key, paste into `RESEND_API_KEY` in env vars.
4. Set `NOTIFY_EMAILS` to a comma-separated list of recipients.
5. Set `NOTIFY_FROM` to a verified address.

If `RESEND_API_KEY` is unset, the form returns success and logs the payload to your terminal — handy for testing without burning sends.

---

## Avail (rental applications)

Each unit's "Apply Now" button points to a unique Avail listing URL. Avail is owned by Realtor.com and handles screening (credit, criminal, eviction).

### Setup

1. Sign up at [avail.co](https://www.avail.co) — free for landlords.
2. Add the property: 8638 Trout Ave, Kings Beach, CA.
3. Create a listing for each of the 8 units. Each listing produces its own application URL.
4. In Sanity Studio: open each unit → **Links → Avail application URL** → paste the URL.
5. Publish.

The `applyUrlFallback` in Site settings is what `/apply`'s top-level "Start Application" button points to — set this to a generic Avail account URL or your most-applied-to unit.

---

## Routes

| Route                  | What it is                                    |
| ---------------------- | --------------------------------------------- |
| `/`                    | Homepage (hero, value props, available units) |
| `/units`               | All units, filterable                         |
| `/units/[unitNumber]`  | Unit detail (gallery, pricing, contact form)  |
| `/short-stays`         | Featured unit as STR — Airbnb funnel          |
| `/neighborhood`        | Neighborhood + seasons                        |
| `/apply`               | Application steps + FAQ                       |
| `/studio`              | **Sanity Studio (editing UI)**                |
| `/api/contact`         | POST — contact form handler                   |
| `/api/subscribe`       | POST — email capture handler                  |
| `/sitemap.xml`         | Auto-generated                                |
| `/robots.txt`          | Auto-generated                                |

---

## Architecture notes

- **Next.js 14** App Router. Public pages live in the `(marketing)` route group with shared header/footer; the Studio sits at `/studio` outside that group so it renders fullscreen.
- **Sanity v3** embedded in the Next.js app. One project, one deploy, one login.
- **ISR**: each marketing page revalidates every 60s, so Sanity edits go live within a minute. No manual deploys needed for content changes.
- **Tailwind** with custom design tokens in `tailwind.config.ts` (cream/ivory/charcoal/forest palette, Fraunces + Inter fonts).
- **Image pipeline**: photos in Sanity are served via CDN (`cdn.sanity.io`), with Next.js's image optimizer on top for responsive sizes and modern formats.
- **Static generation**: all marketing pages prerender at build time. Unit detail pages use `generateStaticParams` populated from Sanity.
- **Graceful degradation**: if `NEXT_PUBLIC_SANITY_PROJECT_ID` is unset, pages render fallback content rather than crashing — useful for first-time clones.

---

## Scripts

```bash
npm run dev                       # local dev server (public + studio)
npm run build                     # production build
npm run start                     # run production build locally
npm run lint                      # next lint
npm run typecheck                 # tsc --noEmit
npm run sanity:seed               # one-time: populate Sanity from data/units.ts
npm run images:optimize           # rebuild /public images from /PHOTOS (legacy — Sanity handles photos now)
```

---

## Image credits

- Property and unit photos: © Trout House LLC, all rights reserved.
- `/lake/north-shore.jpg` (used as the seed for the Neighborhood hero) — aerial of 6870 N Lake Blvd, Tahoe Vista, by [Edgar Chaparro on Unsplash](https://unsplash.com/photos/hj-ycpqyn8o), free under the Unsplash License.

---

## Files of interest

- `sanity/schemaTypes/` — content models (edit these to add new fields)
- `sanity/structure.ts` — Studio sidebar layout
- `lib/sanity/queries.ts` — GROQ queries used by pages
- `lib/sanity/types.ts` — TypeScript types matching the schemas
- `scripts/seed-sanity.ts` — one-time seed (idempotent)
