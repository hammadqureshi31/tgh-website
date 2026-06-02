"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { blogPostSchema } from "@/lib/validations/blog";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { BlogPostInsert, BlogPostUpdate } from "@/lib/types/database";
import { SupabaseClient } from "@supabase/supabase-js";

// =====================
// SERVICE ROLE CLIENT
// =====================
async function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

// =====================
// UTILITIES
// =====================
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// =====================
// SLUG CHECK
// =====================
async function ensureUniqueSlug(
  supabase: SupabaseClient,
  baseSlug: string,
  excludeId?: string,
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    let query = supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", slug)
      .limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Slug check failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// =====================
// CREATE POST
// =====================
export async function createPost(formData: any) {
  try {
    if (formData.id) {
      return updatePost(formData.id, formData);
    }

    const supabase = await createAdminClient();

    const validated = blogPostSchema.parse(formData);

    const baseSlug = generateSlug(validated.title);
    const slug = await ensureUniqueSlug(supabase as any, baseSlug);

    const readingTime = validated.content
      ? calculateReadingTime(validated.content)
      : null;

    const postData: BlogPostInsert = {
      title: validated.title,
      slug,
      excerpt: validated.excerpt || null,
      content: validated.content || null,
      featured_image: validated.featured_image || null,
      meta_title: validated.meta_title || null,
      meta_description: validated.meta_description || null,
      author_id: validated.author_id || null,
      category_id: validated.category_id || null,
      status: validated.status || "draft",
      is_featured: validated.is_featured || false,
      reading_time: readingTime,
      published_at: validated.status === "published" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// =====================
// UPDATE POST
// =====================
export async function updatePost(id: string, formData: unknown) {
  try {
    const supabase = await createAdminClient();
    const validated = blogPostSchema.parse(formData);

    const slug = await ensureUniqueSlug(
      supabase as any,
      generateSlug(validated.title),
      id,
    );

    const updateData: BlogPostUpdate = {
      title: validated.title,
      slug,
      excerpt: validated.excerpt || null,
      content: validated.content || null,
      featured_image: validated.featured_image || null,
      meta_title: validated.meta_title || null,
      meta_description: validated.meta_description || null,
      author_id: validated.author_id || null,
      category_id: validated.category_id || null,
      status: validated.status || "draft",
      is_featured: validated.is_featured || false,
      reading_time: validated.content
        ? calculateReadingTime(validated.content)
        : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return { success: true, data };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// =====================
// DELETE (SOFT)
// =====================
export async function deletePost(id: string) {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("blog_posts")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

// =====================
// PUBLISH
// =====================
export async function publishPost(id: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

// =====================
// UNPUBLISH
// =====================
export async function unpublishPost(id: string) {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      status: "draft",
      published_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

interface GetAdminPostsParams {
  page?: number;
  search?: string;
  status?: string;
}

export async function getAdminPosts({
  page = 1,
  search = "",
  status = "all",
}: GetAdminPostsParams) {
  try {
    const supabase = await createAdminClient();
    const serverClient = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    // Build query with joins
    let query = supabase.from("blog_posts").select(
      `
        *,
        author:author_id(id, name, email),
        category:category_id(id, name, slug)
      `,
      { count: "exact" },
    );

    // Exclude archived posts by default (but allow filtering for them)
    if (status !== "archived") {
      query = query.neq("status", "archived");
    }

    // Apply status filter
    if (status && status !== "all" && status !== "archived") {
      query = query.eq("status", status);
    } else if (status === "archived") {
      query = query.eq("status", "archived");
    }

    // Apply search filter
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`);
    }

    // Order and paginate
    const {
      data: posts,
      count,
      error,
    } = await query
      .order("updated_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Failed to fetch posts: ${error.message}`,
      };
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 1;

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
    };
  } catch (error) {
    console.error("Get admin posts error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPost(id: string) {
  try {
    const supabase = await createAdminClient();
    const serverClient = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("blog_posts")
      .select(
        `
        *,
        author:author_id(id, name, email),
        category:category_id(id, name, slug)
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Failed to fetch post: ${error.message}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Get post error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAuthorsAndCategories() {
  try {
    const supabase = await createAdminClient();
    const serverClient = await createServerSupabaseClient();

    // Verify authentication
    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const [authorsResult, categoriesResult] = await Promise.all([
      supabase.from("authors").select("id, name").order("name"),
      supabase.from("categories").select("id, name").order("name"),
    ]);

    if (authorsResult.error) {
      return { success: false, error: authorsResult.error.message };
    }

    if (categoriesResult.error) {
      return { success: false, error: categoriesResult.error.message };
    }

    return {
      success: true,
      data: {
        authors: authorsResult.data,
        categories: categoriesResult.data,
      },
    };
  } catch (error) {
    console.error("Get authors and categories error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function createCategory(name: string) {
  try {
    const supabase = await createAdminClient();
    const serverClient = await createServerSupabaseClient();

    const {
      data: { user },
    } = await serverClient.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const baseSlug = generateSlug(name);
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data, error } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .limit(1);

      if (error) {
        throw new Error(`Failed to check slug uniqueness: ${error.message}`);
      }

      if (data.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const { data, error } = await (supabase as any)
      .from("categories")
      .insert([{ name, slug }])
      .select("id, name")
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: `Failed to create category: ${error.message}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
