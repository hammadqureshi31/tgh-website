# Blog CMS Setup Guide

## Database Schema

The blog CMS requires the following tables, which are already created:

- **blog_posts**: Main blog post content
- **authors**: Blog post authors
- **categories**: Blog post categories

Run migrations to enable the archived status:

```bash
npx supabase migration up
```

## Supabase Storage Setup

### 1. Create Storage Bucket

1. Go to Supabase Dashboard
2. Navigate to Storage > Buckets
3. Create a new bucket called `blog-images`
4. Set it to **Public** (important for public URL access)

### 2. Set Storage Policies

Replace the default policies with these:

**Policy 1: Public Read Access**
- Name: `Enable public read access`
- Definition: `(bucket_id = 'blog-images')`
- Roles: `anon`, `authenticated`
- Allowed operations: `SELECT`

**Policy 2: Authenticated Write Access**
- Name: `Enable authenticated write access`
- Definition: `(bucket_id = 'blog-images')`
- Roles: `authenticated`
- Allowed operations: `INSERT`, `UPDATE`

**Policy 3: Authenticated Delete Access**
- Name: `Enable authenticated delete access`
- Definition: `(bucket_id = 'blog-images')`
- Roles: `authenticated`
- Allowed operations: `DELETE`

### 3. Verify Settings

After creating the bucket and policies:
1. Upload a test image
2. Confirm the public URL is accessible without authentication
3. Confirm authenticated users can upload and delete

## Using the Blog CMS

### Create a New Post

1. Navigate to `/admin/blog`
2. Click "New Post"
3. Fill in the post details:
   - **Title**: Required, auto-generates SEO-friendly slug
   - **Excerpt**: Optional summary
   - **Featured Image**: Drag & drop upload
   - **Content**: Rich text editor with image support
   - **Meta Information**: SEO optimization
   - **Post Settings**: Author, category, featured flag

4. Save as Draft or Publish immediately
5. Auto-save occurs every 60 seconds

### Edit Existing Post

1. Navigate to `/admin/blog`
2. Find the post in the list
3. Click the edit icon
4. Make changes
5. Click "Save Changes"
6. Use "Publish/Unpublish" toggle to change status

### Delete Post

1. Open the post for editing
2. Click "Delete" button
3. Confirm deletion (posts are soft-deleted as "archived")

## Features

### Blog Editor (TipTap)

The rich text editor includes:
- **Headings**: H1, H2, H3
- **Text Formatting**: Bold, Italic, Strikethrough
- **Lists**: Bullet list, Ordered list
- **Blocks**: Blockquote, Code block, Horizontal rule
- **Media**: Image upload with preview
- **Links**: URL with popover input
- **Undo/Redo**: Full history
- **Character Counter**: Shows/enforces 50k character limit

### Image Upload

- Drag & drop support
- Accepts: JPG, PNG, WebP, AVIF
- Max size: 5MB
- Auto-generates unique filenames
- Returns public URL
- Integrated with TipTap editor

### Auto-Save

- Drafts auto-save every 60 seconds
- Unsaved changes indicator
- Warning when navigating away with unsaved changes
- Last saved timestamp displayed

### Slug Generation

- Auto-generates SEO-friendly slugs from titles
- Removes special characters and spaces
- Ensures uniqueness by appending counter if needed
- Persists across updates

### Reading Time Calculation

- Auto-calculated based on content word count
- Average: 200 words per minute
- Updates on every content change

### Soft Delete

- Posts are archived, not permanently deleted
- Archived posts hidden from admin list by default
- Can be unarchived if needed (add feature later)

## Environment Variables

Ensure these are set in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Admin Authentication

All blog admin routes require authentication:

- `/admin/blog` - View posts
- `/admin/blog/new` - Create post
- `/admin/blog/[id]/edit` - Edit post
- Protected by middleware in `middleware.ts`

Unauthenticated users are redirected to `/admin/login`.

## API Routes

### POST `/api/upload-image`

Upload image for use in blog posts.

**Request:**
```
Content-Type: multipart/form-data
Body: FormData with 'file' field

Accepted: image/jpeg, image/png, image/webp, image/avif
Max size: 5MB
```

**Response:**
```json
{
  "url": "https://...",
  "path": "path/to/file.jpg"
}
```

## Troubleshooting

### Images not uploading

1. Check Supabase Storage bucket exists
2. Verify Storage RLS policies are correct
3. Confirm authenticated user has write permission
4. Check browser console for error details

### Posts not saving

1. Verify Supabase connection
2. Check user authentication status
3. Verify database table permissions
4. Check browser network tab for API errors

### Slow performance

1. Reduce content size (TipTap editor has 50k char limit)
2. Optimize featured images before upload
3. Check Supabase project performance metrics
4. Consider adding pagination to post lists

## Future Enhancements

- Scheduled post publishing
- Post revisions/history
- Bulk operations (publish multiple, export)
- Advanced search filters
- Post comments/discussions
- Analytics integration
- SEO preview
- Markdown import/export
