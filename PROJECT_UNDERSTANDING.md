# PROJECT_UNDERSTANDING.md

**The Gentry House (TGH) — Architecture & Business Audit**
Prepared as a read-only technical audit. No code was modified in producing this report.

---

## 1. Tech Stack

### Framework & Core
- **Next.js 16.2.6** — App Router (`/src/app`)
- **React 18.3.1**
- **TypeScript 5** (strict mode), no plain JS files
- **Tailwind CSS 3.4.17** + PostCSS/autoprefixer — utility-first styling, luxury color theme in `tailwind.config.ts`
- Fonts via `@fontsource`: Playfair Display (headings), Outfit (body), Space Mono (labels)

### State Management
- No global state library (no Redux/Zustand/Context for app state)
- Forms: `react-hook-form` + `zod` via `@hookform/resolvers`
- Local UI state only (`useState`/`useRef`/`useEffect`)

### Animation
- **Framer Motion 11.12** — carousels, modals, section reveals

### Database & Backend
- **Supabase** (PostgreSQL): `@supabase/supabase-js` (browser client), `@supabase/ssr` (server/cookie-aware client)
- No ORM — raw SQL migrations in `/supabase/migrations/` + hand-maintained generated types in `src/lib/types/database.ts`
- Supabase Storage for blog image uploads

### Authentication
- **Supabase Auth** (email/password) for admin users only — no auth on the public site
- Authorization enforced via **Row-Level Security (RLS)** policies, not app-level role checks
- Two seeded roles (Admin, Editor) exist in seed data but **the app does not actually differentiate behavior between them** — effectively a single "authenticated = admin" permission level

### Email
- **Resend** for transactional email (lead notifications), template at `src/lib/email/templates/lead-notification.tsx`

### Rich Text / CMS Editor
- **Tiptap** (Prosemirror) powers the admin blog editor
- `react-quill-new` + Quill plugins are still in `package.json` and there's an unused `QuillEditorWrapper.tsx` — **dead dependency**, Tiptap superseded it

### SEO Tooling
- `next-sitemap`, `next-indexnow` (Microsoft IndexNow), `generateMetadata`, JSON-LD, OpenGraph/Twitter cards

### Hosting
- **Vercel** (inferred from `next.config.ts` `allowedOrigins`/server actions CORS config, and standard Next.js deploy target)

### Notable Dead Dependencies (bundle bloat)
- `react-router-dom` — unused, Next.js handles routing natively
- `react-quill-new`, `quill-image-drop-and-paste`, `quill-magic-url` — superseded by Tiptap

---

## 2. Folder Structure

```
src/
├── app/                     Next.js App Router: pages, layouts, API routes, sitemap/robots
│   ├── (public pages)/      /, /about, /services, /gallery, /faq, /blog, /blog/[slug],
│   │                        /lake-saint-louis-barbershop
│   ├── admin/               /admin/login, /admin/blog (+new, +[id]/edit), /admin/leads
│   └── api/                 upload-image, indexnow route handlers
├── components/
│   ├── sections/            Homepage/services page building blocks (Hero, Pricing, FAQ, etc.)
│   ├── blog/                Blog-only components (PostCard, TOC, share buttons, progress bar)
│   ├── admin/                Admin dashboard components (editor, uploads, leads table)
│   ├── forms/                ContactForm (lead capture)
│   └── geo/lake-saint-louis-barberhsop/   Local-SEO landing page sections (note: folder name typo)
├── lib/
│   ├── supabase/             server/client/admin Supabase clients
│   ├── email/                Resend config + email template
│   ├── types/                Generated DB types
│   ├── validations/          Zod schemas (lead, blog)
│   └── utils.ts
└── actions/                  Server actions: leads, blog CRUD, admin-leads, media upload
public/                       Static images, logo, icons, IndexNow verification file
supabase/migrations/          001_initial_schema, 002_rls_policies, 003_add_archived_status
scripts/seed-admin.ts         One-off admin user seeding script
```

### Dead Code Identified
- `QuillEditorWrapper.tsx` — not imported anywhere
- Commented-out `<Header />`/`<Footer />` blocks left in multiple page files
- Commented-out "opening hours" / newsletter block inside `ContactForm.tsx`
- Newsletter signup form in `Footer.tsx` has a `// TODO: connect to newsletter service` and no backend — UI exists, feature does not

### Naming Issues (not duplicates, but inconsistent)
- `geo/lake-saint-louis-barberhsop/` — misspelled ("barberhsop" instead of "barbershop")
- `Readingprogressbar.tsx` — inconsistent casing vs rest of codebase
- `TableOfContents.tsx` vs `TOCSystem.tsx` — two components with overlapping responsibility; unclear which is canonical

### No true duplicate components found
`Services.tsx`, `ServicesHero.tsx`, `ServicesGrid.tsx` look similar by name but serve different pages/layouts — not redundant.

---

## 3. Pages & Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Homepage: hero, about, services, pricing, gallery, testimonials, FAQ, blog teaser, contact form |
| `/about` | `app/about/page.tsx` | Brand story, mission, differentiators |
| `/services` | `app/services/page.tsx` | Full services catalog, includes `Service` JSON-LD with pricing |
| `/gallery` | `app/gallery/page.tsx` | Before/after gallery with lightbox |
| `/faq` | `app/faq/page.tsx` | FAQ accordion |
| `/blog` | `app/blog/page.tsx` | Blog index: search, category filter, pagination |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | Blog post detail: TOC, reading progress, share buttons |
| `/lake-saint-louis-barbershop` | `app/lake-saint-louis-barbershop/page.tsx` | Geo-targeted local-SEO landing page |
| `/admin/login` | `app/admin/login/page.tsx` | Admin sign-in |
| `/admin/blog` | `app/admin/blog/page.tsx` | Blog post dashboard |
| `/admin/blog/new`, `/admin/blog/[id]/edit` | — | Create/edit blog posts (Tiptap) |
| `/admin/leads` | `app/admin/leads/page.tsx` | Leads CRM table |
| `/api/upload-image` | route handler | Image upload to Supabase Storage |
| `/api/indexnow` | route handler | Notifies Microsoft IndexNow of new/changed URLs |

### Missing standard pages
- No `/contact` page — contact form lives only as a homepage section
- No **Privacy Policy** or **Terms of Service** page
- No custom `not-found.tsx` (404) — default Next.js 404 is served
- No staff/barber profile pages

---

## 4. Components

**Layout/Nav:** `Header`, `Footer`, `MobileBookingButton`
**Sections:** `Hero`, `About`, `Services`, `ServicesHero`, `ServicesGrid`, `Pricing`, `Gallery`, `Blog`, `Testimonials`, `FAQ`, `CTASection`
**Forms:** `ContactForm` (validation, honeypot, rate-limited)
**Blog:** `PostCard`, `TableOfContents`, `TOCSystem`, `ShareButtons`, `Readingprogressbar`
**Admin:** `BlogEditor` (Tiptap), `FeaturedImageUpload`, `LeadsTable`, `DeletePostButton`, `QuillEditorWrapper` (unused)
**Geo:** `GeoHero`, `LocalSEOSection`, `TransformationsSection`, `WhyTGHSection`, `ExperienceSection`, `TrustBar`

No component library is used (no shadcn/MUI/Headless UI) — everything is custom Tailwind + Framer Motion. The codebase is consistently typed but several components (`Services.tsx` ~410 lines, `ContactForm.tsx` ~549 lines, `Hero.tsx` ~317 lines) are large and mix data, layout, and interaction logic in one file.

---

## 5. SEO Infrastructure

- **Metadata**: root `generateMetadata` in `layout.tsx` plus per-page overrides on `/services`, `/blog`, `/blog/[slug]`, and the geo page. `/about` has no override and inherits root metadata.
- **Sitemap** (`app/sitemap.ts`): only static routes are listed — **blog post slugs are not included**, meaning published posts are invisible to crawlers via sitemap.
- **Robots** (`app/robots.ts`): correctly disallows `/admin` and `/api/`, references sitemap.
- **Structured Data (JSON-LD)**:
  - Root layout emits a `LocalBusiness` schema, but the address is **hardcoded to "120 Fifth Avenue, New York, NY 10011"** — this does not match the actual business location (Lake Saint Louis, MO, per the geo landing page and About content). **This is the single highest-impact SEO bug found.**
  - `/services` emits a `Service` schema with an `OfferCatalog` including real prices — good for rich results, separate from the bad LocalBusiness address.
- **OpenGraph/Twitter cards**: present on root and key pages.
- **Internal linking**: standard nav + footer links, blog category links, no breadcrumbs.

---

## 6. Analytics Infrastructure

**None found.** No GA4 (`gtag`/`G-…`), no GTM container, no Meta/Facebook Pixel, no Microsoft Clarity, no Search Console verification tag. The site currently has **zero visibility into traffic, conversions, or lead source attribution** — leads land in Supabase but there's no way to tell which channel drove them beyond the `utm_*` columns already present (but unused without an analytics layer to populate/report on them).

---

## 7. Performance

- `next/image` is used broadly and correctly (`remotePatterns` whitelists Unsplash + the Supabase storage domain); `priority` set on above-the-fold hero/featured images.
- Bundle bloat from dead deps (`react-router-dom`, Quill packages) — should be removed.
- Tiptap (admin-only, ~200KB) is currently bundled without being code-split to `/admin` — worth lazy-loading.
- Client/server component split is generally sound: interactive pieces (Hero carousel, modals, forms) are `'use client'`; blog listing/detail pages fetch server-side.

---

## 8. Security

- **Secrets**: properly isolated to `.env.local` (gitignored); only `.env.local.example` is committed, names only — `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `EDITOR_EMAIL`/`EDITOR_PASSWORD`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, `INDEXNOW_KEY`, `NEXT_PUBLIC_SITE_URL`. No hardcoded secrets found in source.
- **Lead submission** (`actions/leads.ts`): Zod-validated, honeypot field, in-memory rate limiting (3/hr/IP) — solid for a single-instance deploy but won't hold up distributed, and IP detection via `x-forwarded-for` is spoofable.
- **RLS policies**: well-scoped — leads are write-only for the public, read/write restricted to service role; blog posts are publicly readable only when `status='published' AND published_at <= now()`.
- **Auth gaps**: no MFA, no visible logout, no password-reset flow, and despite two seeded roles (Admin/Editor) there is no actual authorization differentiation in code — any authenticated session has full admin rights.
- **API routes**: `/api/indexnow` and `/api/upload-image` lack explicit rate limiting (lead submission is the only rate-limited endpoint).

---

## 9. Database Architecture

PostgreSQL via Supabase, 4 tables, no ORM:

- **`leads`** — standalone; `name`, `email`, `phone`, `service_interest`, `message`, `source_page`, `utm_source/medium/campaign`, `status` (enum: new/contacted/booked/closed). Indexed on `status`, `created_at`.
- **`authors`** — `name`, `slug`, `bio`, `avatar_url`, `email`; referenced by `blog_posts.author_id`.
- **`categories`** — `name`, `slug`, `description`; referenced by `blog_posts.category_id`.
- **`blog_posts`** — `title`, `slug` (unique), `excerpt`, `content`, `featured_image`, `meta_title`, `meta_description`, `author_id` (FK, SET NULL), `category_id` (FK, SET NULL), `status` (draft/published/scheduled/archived), `published_at`, `is_featured`, `reading_time`. Indexed on `slug`, `status`, `published_at`, `author_id`, `category_id`.

Indexing looks appropriate for current query patterns. No full-text search index exists — blog search likely uses `ILIKE`, which will degrade past a modest post count. No tags table, no comments table, no media/asset library table (image URLs stored as plain text pointing at Supabase Storage), no newsletter-subscribers table.

---

## 10. Technical Debt

- `as any` / `any` typing leaks in a few places (`app/blog/page.tsx`, `actions/blog.ts`) despite an otherwise strict TypeScript codebase.
- Large multi-responsibility components (`Services.tsx`, `ContactForm.tsx`, `Hero.tsx`, `app/blog/page.tsx`) — would benefit from decomposition.
- Hardcoded content: services list, pricing table, and FAQ entries are all literal arrays inside component files rather than data-driven — every content change requires a code deploy.
- Inline hex colors (`#f8f5f0`, `#2D2D2D`) bypass the Tailwind theme in places.
- Commented-out dead code left in place instead of removed (rely on git history instead).
- Folder/file naming typos (`barberhsop`, `Readingprogressbar`) and one apparent duplicate concept (`TableOfContents` vs `TOCSystem`).

---

## 11. Business Understanding

**What TGH does today**: The Gentry House is a premium men's barbershop/grooming business, single location in Lake Saint Louis, MO. Pricing runs $8–$70 per service (haircuts $40–70, shaves/beard work $15–50, grooming extras $8–10), positioned against both budget chains and crowded local shops on the strength of a "luxury experience" (hot towel service, premium products, "executive grooming"). Booking is outsourced to **Booksy** (third-party widget) rather than a custom system. Marketing relies on a blog/journal, a gallery, testimonials, and one geo-targeted local-SEO landing page.

**Missing business functionality**:
- No analytics anywhere → no way to measure marketing ROI or attribute leads to channel
- No privacy policy / terms of service → legal exposure
- No real role separation between Admin/Editor despite both being seeded
- Newsletter capture UI exists but has no backend — actively misleading to whoever signs up
- No gift cards, no retail/product sales, no loyalty/membership program, no staff bios
- Single-location only; "across the US" messaging on the About page implies multi-location ambition not yet reflected in the data model (no `locations` table) or codebase

**Readiness for product launch**: The engineering foundation (Next.js/Supabase/RLS/Zod validation) is solid and production-credible. The blockers to a confident launch are not architectural — they're the **wrong business address baked into JSON-LD**, **zero analytics**, and **missing legal pages**. None of these require a rebuild; they're targeted fixes.

---

## Recommended Priority Order (no code changed yet — for your review)

1. **Fix the LocalBusiness JSON-LD address** in `app/layout.tsx` (currently NYC, should be Lake Saint Louis, MO) — highest-impact, lowest-effort SEO fix.
2. **Add GA4 + Meta Pixel** — currently flying blind on every lead and every dollar of ad spend.
3. **Add Privacy Policy & Terms pages.**
4. **Add blog post slugs to `sitemap.ts` dynamically** instead of only static routes.
5. Remove dead dependencies (`react-router-dom`, Quill packages, `QuillEditorWrapper.tsx`) and fix the `barberhsop` typo.
6. Decide whether Admin/Editor roles should actually differ in capability, or simplify to one role honestly.

I have not made any of these changes — flag which ones you'd like me to act on and I'll scope each as its own task.
