-- Recruitment system: job applications table, indexes, RLS, and storage buckets

-- Create job_applications table
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  full_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  years_experience integer NOT NULL,
  instagram_url text,
  current_shop text,
  position_applied text NOT NULL,
  preferred_location text NOT NULL,
  resume_url text NOT NULL,
  portfolio_urls jsonb DEFAULT '[]'::jsonb,
  additional_notes text,
  status text DEFAULT 'new' CHECK (
    status IN (
      'new',
      'reviewing',
      'interview_scheduled',
      'interview_completed',
      'offer_sent',
      'hired',
      'rejected',
      'archived'
    )
  ),
  review_notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

-- Indexes for dashboard filtering/sorting
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_created_at_desc ON job_applications(created_at DESC);
CREATE INDEX idx_job_applications_position ON job_applications(position_applied);
CREATE INDEX idx_job_applications_location ON job_applications(preferred_location);

-- ============ ROW LEVEL SECURITY ============

ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- No public read or direct write on applications (submissions go through the
-- service-role server action, same pattern as the leads table)
CREATE POLICY "job_applications_no_public_read" ON job_applications
  FOR SELECT USING (false);

CREATE POLICY "job_applications_no_public_write" ON job_applications
  FOR INSERT WITH CHECK (false);

-- Authenticated admin users can read/update/delete (dashboard)
CREATE POLICY "job_applications_authenticated_read" ON job_applications
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "job_applications_authenticated_update" ON job_applications
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "job_applications_authenticated_delete" ON job_applications
  FOR DELETE TO authenticated
  USING (true);

-- Service role (used by the public application server action) has full access
CREATE POLICY "job_applications_service_role_access" ON job_applications
  FOR ALL USING (auth.role() = 'service_role');

-- ============ STORAGE BUCKETS ============
-- Buckets must be created once (Supabase Dashboard > Storage, or via the
-- supabase CLI / management API) since `storage.buckets` inserts require the
-- service role and are not portable across projects through plain SQL run by
-- anon/authenticated roles. The statements below are safe to run from the
-- SQL editor with the service role and are idempotent.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-resumes',
  'job-resumes',
  false,
  10485760, -- 10MB
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'job-portfolios',
  'job-portfolios',
  false,
  10485760, -- 10MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Resumes/portfolios are private buckets (not public like blog-images), since
-- applicant documents are PII. Only the service role (server actions) and
-- authenticated admin users (dashboard, via signed URLs) can read them.

CREATE POLICY "job_resumes_service_role_all" ON storage.objects
  FOR ALL USING (bucket_id = 'job-resumes' AND auth.role() = 'service_role');

CREATE POLICY "job_resumes_authenticated_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'job-resumes');

CREATE POLICY "job_portfolios_service_role_all" ON storage.objects
  FOR ALL USING (bucket_id = 'job-portfolios' AND auth.role() = 'service_role');

CREATE POLICY "job_portfolios_authenticated_read" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'job-portfolios');
