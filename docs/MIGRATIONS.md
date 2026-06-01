# Database Migrations Guide

This guide walks you through applying the TGH database schema and row-level security policies to your Supabase instance.

## Schema Overview

The migrations create four core tables:

- **leads** — Contact form submissions from potential clients
- **authors** — Blog post authors (synced with Supabase Auth users)
- **categories** — Blog post categories
- **blog_posts** — Blog post content with author and category references

All tables have Row Level Security (RLS) enabled. See [PATH B](#path-b--supabase-dashboard-sql-editor) for security policy details.

---

## PATH A — Supabase CLI (Recommended)

### Prerequisites

- Node.js 18+ installed
- Supabase account and project created
- Project reference ID (see "Finding Your Project Ref" below)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

Or use your system package manager:

**macOS (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Ubuntu/Debian:**
```bash
sudo apt-get install supabase-cli
```

### Step 2: Login to Supabase

```bash
supabase login
```

This opens a browser to create an access token. Paste the token into the CLI prompt.

### Step 3: Link Your Project to Remote

```bash
supabase link --project-ref YOUR_PROJECT_REF tntdudgplexokfnprdlb
```

Replace `YOUR_PROJECT_REF` with your actual project reference (see "Finding Your Project Ref" below).

You will be prompted to enter your Supabase database password. This is the password you set when creating your project.

### Step 4: Push Migrations to Database

```bash
supabase db push
```

The CLI detects all `.sql` files in `supabase/migrations/` and applies them in order.

Expected output:
```
Applying migration 001_initial_schema.sql
Applying migration 002_rls_policies.sql
✓ Migrations applied successfully
```

### Step 5: Verify Migration Success

```bash
supabase db diff
```

If there are no pending changes, the output will be empty or show "No changes detected."

Check the remote database in Supabase Dashboard:
1. Go to **SQL Editor** → **New Query**
2. Run: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
3. You should see: `leads`, `authors`, `categories`, `blog_posts`

---

## PATH B — Supabase Dashboard SQL Editor

Use this path if you prefer not to install the CLI or for quick one-off setup.

### Step 1: Open Supabase Dashboard SQL Editor

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your TGH project
3. In the left sidebar, click **SQL Editor**
4. Click **New Query**

### Step 2: Apply Initial Schema

1. Open `supabase/migrations/001_initial_schema.sql` from this repository
2. Copy **all** the SQL content
3. Paste into the SQL Editor query box
4. Click **Run**

Wait for the query to complete. You should see a confirmation message.

**Common Error:**
```
relation "leads" already exists
```

This means the table was already created. You can safely ignore this or skip to Step 3.

### Step 3: Apply RLS Policies

1. Open `supabase/migrations/002_rls_policies.sql` from this repository
2. Copy **all** the SQL content
3. Click **New Query** in the SQL Editor
4. Paste the RLS SQL content
5. Click **Run**

Wait for completion. You should see:
```
ALTER TABLE ...
CREATE POLICY ...
```

### Step 4: Verify Tables Created

1. In the left sidebar, click **Table Editor**
2. You should see these tables in the list:
   - `leads`
   - `authors`
   - `categories`
   - `blog_posts`

Click each table to inspect its columns and structure.

### Step 5: Verify RLS is Enabled

For each table, check that RLS is enabled:

1. Click the table name
2. In the top right, you'll see an **RLS** toggle
3. It should be **ON** (blue)

If any table has RLS disabled, click the toggle to enable it.

---

## Finding Your Project Ref

Your project reference is visible in two places:

**Option 1: URL**
```
https://app.supabase.com/projects/YOUR_PROJECT_REF/settings/general
```

**Option 2: Dashboard Settings**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your TGH project
3. Click **Settings** (bottom left)
4. Click **General**
5. Under "Project Credentials," copy the value from **Project Ref**

It looks like: `abcdefghijklmnopqrst`

---

## Resetting Migrations (If Needed)

If you need to start fresh:

### Using CLI

```bash
# Drop all tables and start over
supabase db reset
supabase db push
```

### Using Dashboard SQL Editor

1. Go to **SQL Editor** → **New Query**
2. Run this to see all tables:
   ```sql
   DROP TABLE IF EXISTS blog_posts CASCADE;
   DROP TABLE IF EXISTS categories CASCADE;
   DROP TABLE IF EXISTS authors CASCADE;
   DROP TABLE IF EXISTS leads CASCADE;
   ```
3. Then re-run Steps 2-3 above to reapply migrations

**Warning:** This permanently deletes all data in these tables. Use only for development.

---

## Troubleshooting

### "permission denied for schema public"

You likely need to use the database password, not your dashboard password.

**Solution (CLI):**
```bash
supabase link --project-ref YOUR_PROJECT_REF
# Enter your database password when prompted
```

### "role 'authenticated' already exists"

This is normal. Supabase creates these roles automatically. You can safely ignore this error.

### Migrations don't appear in Dashboard

1. Refresh the Supabase Dashboard
2. Check the **Settings** → **Infrastructure** tab for migration status
3. If stuck, contact Supabase support with your project ref

### "relation already exists" error

The table or constraint already exists. This is safe to ignore. Rerun the migration on a fresh project to see proper output.

---

## Next Steps

After applying migrations, see **README.md** for:

1. Environment variable setup
2. Running the admin seed script
3. Logging into the admin panel

---

## Additional Resources

- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Database Migrations Best Practices](https://supabase.com/docs/guides/migrations)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
