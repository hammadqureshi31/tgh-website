-- Add support for archived status in blog_posts

-- Drop existing constraint and add new one with archived status
ALTER TABLE blog_posts 
DROP CONSTRAINT blog_posts_status_check;

ALTER TABLE blog_posts
ADD CONSTRAINT blog_posts_status_check 
CHECK (status IN ('draft','published','scheduled','archived'));

-- Add index for archived posts queries
CREATE INDEX idx_blog_posts_archived ON blog_posts(status) WHERE status = 'archived';
