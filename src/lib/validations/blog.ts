import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  excerpt: z
    .string()
    .trim()
    .max(500, 'Excerpt must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  content: z
    .string()
    .min(1, 'Content is required')
    .optional()
    .or(z.literal('')),
  featured_image: z
    .string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal('')),
  meta_title: z
    .string()
    .trim()
    .max(60, 'Meta title must not exceed 60 characters')
    .optional()
    .or(z.literal('')),
  meta_description: z
    .string()
    .trim()
    .max(160, 'Meta description must not exceed 160 characters')
    .optional()
    .or(z.literal('')),
  category_id: z
    .string()
    .uuid('Invalid category ID')
    .optional()
    .or(z.literal('')),
  author_id: z
    .string()
    .uuid('Invalid author ID')
    .optional()
    .or(z.literal('')),
  status: z.enum(['draft', 'published', 'scheduled']).default('draft'),
  is_featured: z.boolean().default(false),
})

export type BlogPostFormData = z.infer<typeof blogPostSchema>
