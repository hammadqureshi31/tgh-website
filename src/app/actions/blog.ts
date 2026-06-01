'use server'

import { z } from 'zod'
import type { BlogPostInsert, BlogPostUpdate } from '@/lib/types/database'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { blogPostSchema } from '@/lib/validations/blog'

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Utility function to calculate reading time (avg 200 words per minute)
function calculateReadingTime(html: string): number {
  // Strip HTML tags
  const text = html.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// Ensure slug uniqueness by appending a counter if needed
async function ensureUniqueSlug(
  supabase: Awaited<ReturnType<typeof createServerSupabaseClient>>,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    let query = supabase.from('blog_posts').select('id').eq('slug', slug)

    if (excludeId) {
      query = query.neq('id', excludeId)
    }

    const { data, error } = await query.limit(1)

    if (error) {
      throw new Error(`Failed to check slug uniqueness: ${error.message}`)
    }

    if (data.length === 0) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export async function createPost(formData: unknown) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    let validatedData: z.infer<typeof blogPostSchema>
    try {
      validatedData = blogPostSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        return { success: false, errors: fieldErrors }
      }
      return { success: false, error: 'Validation failed' }
    }

    // Generate slug and ensure uniqueness
    const baseSlug = generateSlug(validatedData.title)
    const slug = await ensureUniqueSlug(supabase, baseSlug)

    // Calculate reading time
    const readingTime = validatedData.content
      ? calculateReadingTime(validatedData.content)
      : null

    // Prepare insert data
    const postData: BlogPostInsert = {
      title: validatedData.title,
      slug,
      excerpt: validatedData.excerpt || null,
      content: validatedData.content || null,
      featured_image: validatedData.featured_image || null,
      meta_title: validatedData.meta_title || null,
      meta_description: validatedData.meta_description || null,
      author_id: validatedData.author_id || null,
      category_id: validatedData.category_id || null,
      status: validatedData.status || 'draft',
      is_featured: validatedData.is_featured || false,
      reading_time: readingTime,
    }

    // Create post
    const { data, error } = await (supabase as any)
      .from('blog_posts')
      .insert([postData])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to create post: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Create post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function updatePost(id: string, formData: unknown) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate input
    let validatedData: z.infer<typeof blogPostSchema>
    try {
      validatedData = blogPostSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors
        return { success: false, errors: fieldErrors }
      }
      return { success: false, error: 'Validation failed' }
    }

    // Generate slug and ensure uniqueness
    const baseSlug = generateSlug(validatedData.title)
    const slug = await ensureUniqueSlug(supabase, baseSlug, id)

    // Calculate reading time
    const readingTime = validatedData.content
      ? calculateReadingTime(validatedData.content)
      : null

    // Prepare update data
    const updateData: BlogPostUpdate = {
      title: validatedData.title,
      slug,
      excerpt: validatedData.excerpt || null,
      content: validatedData.content || null,
      featured_image: validatedData.featured_image || null,
      meta_title: validatedData.meta_title || null,
      meta_description: validatedData.meta_description || null,
      author_id: validatedData.author_id || null,
      category_id: validatedData.category_id || null,
      status: validatedData.status || 'draft',
      is_featured: validatedData.is_featured || false,
      reading_time: readingTime,
      updated_at: new Date().toISOString(),
    }

    // Update post
    const { data, error } = await (supabase as any)
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to update post: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Update post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function deletePost(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    // Soft delete: set status to 'archived'
    const { error } = await (supabase as any)
      .from('blog_posts')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to delete post: ${error.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Delete post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function publishPost(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to publish post: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Publish post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function unpublishPost(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        status: 'draft',
        published_at: null,
        updated_at: new Date().toISOString(),
      } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to unpublish post: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unpublish post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

interface GetAdminPostsParams {
  page?: number
  search?: string
  status?: string
}

export async function getAdminPosts({
  page = 1,
  search = '',
  status = 'all',
}: GetAdminPostsParams) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const pageSize = 20
    const offset = (page - 1) * pageSize

    // Build query with joins
    let query = supabase
      .from('blog_posts')
      .select(
        `
        *,
        author:author_id(id, name, email),
        category:category_id(id, name, slug)
      `,
        { count: 'exact' }
      )

    // Exclude archived posts by default (but allow filtering for them)
    if (status !== 'archived') {
      query = query.neq('status', 'archived')
    }

    // Apply status filter
    if (status && status !== 'all' && status !== 'archived') {
      query = query.eq('status', status)
    } else if (status === 'archived') {
      query = query.eq('status', 'archived')
    }

    // Apply search filter
    if (search) {
      const searchTerm = `%${search}%`
      query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`)
    }

    // Order and paginate
    const { data: posts, count, error } = await query
      .order('updated_at', { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to fetch posts: ${error.message}` }
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 1

    return {
      success: true,
      data: {
        posts,
        pagination: {
          current: page,
          total: totalPages,
          count,
        },
      },
    }
  } catch (error) {
    console.error('Get admin posts error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getPost(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select(
        `
        *,
        author:author_id(id, name, email),
        category:category_id(id, name, slug)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return { success: false, error: `Failed to fetch post: ${error.message}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Get post error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function getAuthorsAndCategories() {
  try {
    const supabase = await createServerSupabaseClient()

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return { success: false, error: 'Unauthorized' }
    }

    const [authorsResult, categoriesResult] = await Promise.all([
      supabase.from('authors').select('id, name').order('name'),
      supabase.from('categories').select('id, name').order('name'),
    ])

    if (authorsResult.error) {
      return { success: false, error: authorsResult.error.message }
    }

    if (categoriesResult.error) {
      return { success: false, error: categoriesResult.error.message }
    }

    return {
      success: true,
      data: {
        authors: authorsResult.data,
        categories: categoriesResult.data,
      },
    }
  } catch (error) {
    console.error('Get authors and categories error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
