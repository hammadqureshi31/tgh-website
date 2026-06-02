-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- ============ LEADS TABLE POLICIES ============

-- No public read or write on leads
CREATE POLICY "leads_no_public_read" ON leads
  FOR SELECT USING (false);

CREATE POLICY "leads_no_public_write" ON leads
  FOR INSERT WITH CHECK (false);

-- Authenticated users can INSERT (form submissions)
CREATE POLICY "leads_authenticated_insert" ON leads
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only service_role can SELECT, UPDATE, DELETE
CREATE POLICY "leads_service_role_access" ON leads
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "leads_service_role_update" ON leads
  FOR UPDATE USING (auth.role() = 'service_role');

CREATE POLICY "leads_service_role_delete" ON leads
  FOR DELETE USING (auth.role() = 'service_role');

-- ============ AUTHORS TABLE POLICIES ============

-- Public SELECT
CREATE POLICY "authors_public_read" ON authors
  FOR SELECT USING (true);

-- Authenticated users can do full CRUD
CREATE POLICY "authors_authenticated_insert" ON authors
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authors_authenticated_update" ON authors
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "authors_authenticated_delete" ON authors
  FOR DELETE TO authenticated
  USING (true);

-- ============ CATEGORIES TABLE POLICIES ============

-- Public SELECT
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Authenticated users can do full CRUD
CREATE POLICY "categories_authenticated_insert" ON categories
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_authenticated_update" ON categories
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "categories_authenticated_delete" ON categories
  FOR DELETE TO authenticated
  USING (true);

-- ============ BLOG_POSTS TABLE POLICIES ============

-- Public SELECT only where status = 'published' AND published_at <= now()
CREATE POLICY "blog_posts_public_read" ON blog_posts
  FOR SELECT USING (
    status = 'published' AND published_at IS NOT NULL AND published_at <= now()
  );

-- Authenticated users can do full CRUD
CREATE POLICY "blog_posts_authenticated_insert" ON blog_posts
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "blog_posts_authenticated_update" ON blog_posts
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "blog_posts_authenticated_delete" ON blog_posts
  FOR DELETE TO authenticated
  USING (true);
