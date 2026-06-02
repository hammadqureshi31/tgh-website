export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          service_interest: string | null
          message: string | null
          source_page: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          status: 'new' | 'contacted' | 'booked' | 'closed'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          service_interest?: string | null
          message?: string | null
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          status?: 'new' | 'contacted' | 'booked' | 'closed'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          service_interest?: string | null
          message?: string | null
          source_page?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          status?: 'new' | 'contacted' | 'booked' | 'closed'
        }
      }
      authors: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          slug: string
          bio: string | null
          avatar_url: string | null
          email: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          slug: string
          bio?: string | null
          avatar_url?: string | null
          email: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          slug?: string
          bio?: string | null
          avatar_url?: string | null
          email?: string
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          name: string
          slug: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          slug: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          slug?: string
          description?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          excerpt: string | null
          content: string | null
          featured_image: string | null
          meta_title: string | null
          meta_description: string | null
          author_id: string | null
          category_id: string | null
          status: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at: string | null
          is_featured: boolean
          reading_time: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at?: string | null
          is_featured?: boolean
          reading_time?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string | null
          featured_image?: string | null
          meta_title?: string | null
          meta_description?: string | null
          author_id?: string | null
          category_id?: string | null
          status?: 'draft' | 'published' | 'scheduled' | 'archived'
          published_at?: string | null
          is_featured?: boolean
          reading_time?: number | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

// ============ LEADS TYPES ============

export type Lead = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']
export type LeadStatus = Lead['status']

// ============ AUTHORS TYPES ============

export type Author = Database['public']['Tables']['authors']['Row']
export type AuthorInsert = Database['public']['Tables']['authors']['Insert']
export type AuthorUpdate = Database['public']['Tables']['authors']['Update']

// ============ CATEGORIES TYPES ============

export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

// ============ BLOG_POSTS TYPES ============

export type BlogPost = Database['public']['Tables']['blog_posts']['Row']
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert']
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update']
export type BlogPostStatus = BlogPost['status']

// ============ ENRICHED/DERIVED TYPES ============

export type BlogPostWithAuthorAndCategory = BlogPost & {
  author?: Author | null
  category?: Category | null
}

export type LeadFormData = Omit<LeadInsert, 'id' | 'created_at' | 'status'> & {
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  source_page?: string | null
}
