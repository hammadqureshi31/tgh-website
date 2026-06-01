# The Gentlemen's House (TGH) — Website

A modern, luxury barbershop website built with Next.js 15, TypeScript, Supabase, and Tailwind CSS.

## Stack

- **Framework:** Next.js 15 App Router
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Email:** Resend
- **Hosting:** Vercel

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/
│   ├── supabase/    # Supabase clients and setup
│   ├── types/       # TypeScript types
│   ├── validations/ # Zod schemas
│   └── email/       # Email templates and setup
supabase/
├── migrations/      # Database migrations
docs/
├── MIGRATIONS.md    # Database setup guide
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd tgh-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in your Supabase credentials and seed variables in `.env.local`

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Database Setup

### Step 1 — Apply Migrations

Follow the detailed guide in [docs/MIGRATIONS.md](docs/MIGRATIONS.md) to apply database migrations.

**Quick start (using Supabase CLI):**
```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

**Project Ref Location:**
- Supabase Dashboard → Settings → General → "Project Ref"

### Step 2 — Set Environment Variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in the required values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Seed Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=YourSecurePassword123!
EDITOR_EMAIL=editor@example.com
EDITOR_PASSWORD=EditorPassword456!
```

**Finding Supabase Credentials:**
1. Go to Supabase Dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `Publishable Key` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `Service Role Key` → `SUPABASE_SERVICE_ROLE_KEY`

**Password Requirements:**
- Minimum 12 characters
- At least one uppercase letter (A-Z)
- At least one number (0-9)
- At least one special character (!@#$%^&*()_+...)
- Example: `MyPassword123!` or `Barbershop@2024`

### Step 3 — Seed Admin Users

Create the admin and editor users:

```bash
npm run seed:admin
```

Expected output:
```
═══════════════════════════════════════
TGH Seed Script — Admin Users
═══════════════════════════════════════

✓ Connected to Supabase
✓ Admin user created: admin@example.com
✓ Admin author row inserted
✓ Editor user created: editor@example.com
✓ Editor author row inserted

═══════════════════════════════════════
Seed complete. You can now log in at:
  /admin/login
═══════════════════════════════════════
```

### Step 4 — Log In to Admin Panel

1. Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login) (or your deployed domain)
2. Use your admin credentials:
   - Email: `ADMIN_EMAIL` from `.env.local`
   - Password: `ADMIN_PASSWORD` from `.env.local`

### Resetting (If Needed)

To delete users and re-seed:

1. Go to Supabase Dashboard
2. Click **Authentication** → **Users**
3. Select the admin or editor user
4. Click **Delete** or **Delete user** from the menu
5. Run the seed script again:
   ```bash
   npm run seed:admin
   ```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start               # Start production server

# Utilities
npm run lint            # Run ESLint
npm run seed:admin      # Seed admin and editor users
```

---

## Database Schema

### Tables

1. **leads**
   - Contact form submissions from potential clients
   - Fields: name, email, phone, service_interest, message, source_page, UTM params
   - RLS: Public INSERT (form submissions), service_role SELECT/UPDATE/DELETE

2. **authors**
   - Blog post authors, synced with Supabase Auth
   - Fields: id, name, slug, email, bio, avatar_url
   - RLS: Public SELECT, authenticated full CRUD

3. **categories**
   - Blog post categories
   - Fields: id, name, slug, description
   - RLS: Public SELECT, authenticated full CRUD

4. **blog_posts**
   - Blog content
   - Fields: title, slug, excerpt, content, featured_image, author_id, category_id, status, published_at, reading_time
   - RLS: Public SELECT (published only), authenticated full CRUD

For detailed schema documentation, see [supabase/migrations/](supabase/migrations/).

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://abc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public API key | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (keep secret) | `eyJh...` |
| `ADMIN_EMAIL` | Admin user email | `admin@example.com` |
| `ADMIN_PASSWORD` | Admin user password (12+ chars) | `MyPassword123!` |
| `EDITOR_EMAIL` | Editor user email | `editor@example.com` |
| `EDITOR_PASSWORD` | Editor user password (12+ chars) | `EditorPass456!` |
| `NEXT_PUBLIC_RESEND_API_KEY` | Email sending API key (optional) | `re_...` |

---

## Deployment

### Vercel

1. Push your repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Add environment variables in **Settings** → **Environment Variables**
4. Deploy

For detailed instructions, see [Vercel + Next.js Guide](https://vercel.com/docs/frameworks/nextjs)

---

## Support

For issues or questions:
- Check [docs/MIGRATIONS.md](docs/MIGRATIONS.md) for database setup issues
- Review Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs

---

## License

Proprietary — The Gentlemen's House
