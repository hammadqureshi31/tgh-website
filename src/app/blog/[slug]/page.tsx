import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import PostCard from '@/components/blog/PostCard'
import ShareButtons from '@/components/blog/ShareButtons'
import TableOfContents from '@/components/blog/TableOfContents'
import { cn } from '@/lib/utils'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: rawPost } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()
  
  const post: any = rawPost

  if (!post) {
    return {
      title: "Post Not Found | The Gentlemen's House"
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || ''
  
  return {
    title: `${title} | The Gentlemen's House`,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at,
      images: post.featured_image ? [{ url: post.featured_image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featured_image ? [post.featured_image] : [],
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch Post
  const { data: rawPost, error } = await supabase
    .from('blog_posts')
    .select('*, authors(*), categories(name, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .single()
  const post: any = rawPost

  if (error || !post) {
    notFound()
  }

  // Fetch Related Posts
  let relatedPosts: any[] = []
  if (post.category_id) {
    const { data } = await supabase
      .from('blog_posts')
      .select('*, authors(name, avatar_url), categories(name, slug)')
      .eq('status', 'published')
      .eq('category_id', post.category_id)
      .neq('id', post.id)
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(3)
    
    if (data) relatedPosts = data
  }

  // Parse HTML for ToC
  let updatedContent = post.content || ''
  const headings: { id: string; text: string; level: 2 | 3 }[] = []

  updatedContent = updatedContent.replace(/<h([23])[^>]*>(.*?)<\/h\1>/gi, (match: string, levelStr: string, textContent: string) => {
    const text = textContent.replace(/<[^>]+>/g, '').trim()
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const level = parseInt(levelStr, 10) as 2 | 3
    
    let finalId = id
    let counter = 1
    while (headings.find(h => h.id === finalId)) {
      finalId = `${id}-${counter}`
      counter++
    }
    
    headings.push({ id: finalId, text, level })
    
    return `<h${level} id="${finalId}">${textContent}</h${level}>`
  })

  const formattedDate = post.published_at 
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(post.published_at))
    : ''

  return (
    <div className="min-h-screen bg-[#F8F5F0] pt-24 pb-32">
      {/* SECTION 1 — Breadcrumb */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-8">
        <nav className="flex items-center gap-2 font-mono text-[10px] uppercase text-luxury-midnight/50" style={{ letterSpacing: '0.1em' }}>
          <Link href="/" className="hover:text-luxury-amber transition-colors">Home</Link>
          <ChevronRight size={10} className="text-luxury-midnight/30" />
          <Link href="/blog" className="hover:text-luxury-amber transition-colors">Journal</Link>
          <ChevronRight size={10} className="text-luxury-midnight/30" />
          <span className="text-luxury-midnight/80 truncate max-w-[200px] sm:max-w-[300px]">
            {post.title}
          </span>
        </nav>
      </div>

      {/* SECTION 2 — Hero */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-lg overflow-hidden">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1400px"
            />
          ) : (
            <div className="w-full h-full bg-luxury-graphite" />
          )}
        </div>
      </div>

      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">
          
          {/* Table of Contents (Desktop Sidebar) */}
          <div className="hidden lg:block lg:col-span-3">
            <TableOfContents headings={headings} />
          </div>

          {/* Article Column */}
          <div className="lg:col-span-8 lg:col-start-4 xl:col-start-4 xl:col-span-7 max-w-[720px] mx-auto w-full">
            
            {/* SECTION 3 — Article header */}
            <header className="mb-12 border-b border-luxury-midnight/10 pb-10">
              {post.categories && (
                <Link
                  href={`/blog?category=${post.categories.slug}`}
                  className="inline-block font-mono text-luxury-amber text-xs uppercase mb-6"
                  style={{ letterSpacing: '0.2em' }}
                >
                  {post.categories.name}
                </Link>
              )}
              
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-midnight leading-tight mb-6">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="font-outfit text-xl text-luxury-midnight/60 leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-luxury-midnight/5">
                {post.authors?.avatar_url ? (
                  <Image
                    src={post.authors.avatar_url}
                    alt={post.authors.name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-luxury-amber/20 flex items-center justify-center shrink-0">
                    <span className="font-outfit text-sm text-luxury-amber font-medium">
                      {post.authors?.name?.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-outfit text-luxury-midnight text-sm font-medium">
                    {post.authors?.name}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono text-luxury-midnight/50 text-[10px] uppercase" style={{ letterSpacing: '0.1em' }}>
                      {formattedDate}
                    </span>
                    {post.reading_time && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-luxury-amber/40" />
                        <span className="font-mono text-luxury-midnight/50 text-[10px] uppercase" style={{ letterSpacing: '0.1em' }}>
                          {post.reading_time} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* SECTION 4 — Article body */}
            <div className={cn(
              "max-w-none text-luxury-midnight",
              "[&>p]:font-outfit [&>p]:text-base [&>p]:md:text-lg [&>p]:leading-[1.85] [&>p]:text-luxury-midnight/80 [&>p]:mb-8",
              "[&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:text-luxury-midnight [&>h2]:mt-16 [&>h2]:mb-6",
              "[&>h3]:font-playfair [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:text-luxury-midnight [&>h3]:mt-12 [&>h3]:mb-4",
              "[&>ul]:font-outfit [&>ul]:text-luxury-midnight/80 [&>ul]:mb-8 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-3 [&>ul>li]:leading-[1.8]",
              "[&>ol]:font-outfit [&>ol]:text-luxury-midnight/80 [&>ol]:mb-8 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-3 [&>ol>li]:leading-[1.8]",
              "[&>blockquote]:border-l-4 [&>blockquote]:border-luxury-amber [&>blockquote]:pl-6 md:[&>blockquote]:pl-8 [&>blockquote]:py-2 [&>blockquote]:my-12 [&>blockquote>p]:font-playfair [&>blockquote>p]:text-xl [&>blockquote>p]:md:text-2xl [&>blockquote>p]:italic [&>blockquote>p]:text-luxury-midnight [&>blockquote>p]:leading-relaxed",
              "[&>img]:w-full [&>img]:rounded-lg [&>img]:my-12 [&>img]:shadow-md",
              "[&>figure]:my-12 [&>figure>img]:w-full [&>figure>img]:rounded-lg [&>figure>img]:shadow-md [&>figcaption]:text-center [&>figcaption]:font-mono [&>figcaption]:text-xs [&>figcaption]:text-luxury-midnight/50 [&>figcaption]:mt-4",
              "[&_a]:text-luxury-amber [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-luxury-whiskey transition-colors",
              "[&_code]:font-mono [&_code]:text-[0.9em] [&_code]:bg-luxury-midnight/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-luxury-midnight",
              "[&>pre]:bg-luxury-midnight/5 [&>pre]:p-6 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-8 [&>pre_code]:bg-transparent [&>pre_code]:p-0 [&>pre_code]:text-luxury-midnight"
            )}>
              <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
            </div>

            {/* SECTION 5 — Social share row */}
            <div className="mt-16 pt-8 border-t border-luxury-midnight/10">
              <ShareButtons title={post.title} />
            </div>

            {/* SECTION 6 — Author bio card */}
            {post.authors && (
              <div className="mt-12 bg-white p-8 rounded-lg shadow-md border border-luxury-midnight/5 flex flex-col md:flex-row items-center md:items-start gap-6">
                {post.authors.avatar_url ? (
                  <Image
                    src={post.authors.avatar_url}
                    alt={post.authors.name}
                    width={64}
                    height={64}
                    className="rounded-full object-cover shrink-0 border border-luxury-midnight/5"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-luxury-amber/20 flex items-center justify-center shrink-0 border border-luxury-midnight/5">
                    <span className="font-outfit text-xl text-luxury-amber font-medium">
                      {post.authors.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="text-center md:text-left">
                  <h3 className="font-playfair text-xl text-luxury-midnight mb-2">
                    {post.authors.name}
                  </h3>
                  {post.authors.bio && (
                    <p className="font-outfit text-luxury-midnight/70 text-sm leading-relaxed max-w-lg">
                      {post.authors.bio}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 7 — Related articles */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 md:mt-32 pt-16 md:pt-24 border-t border-luxury-midnight/10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: '0.25em' }}
              >
                More from the Journal
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {relatedPosts.map((related) => (
                <PostCard
                  key={related.id}
                  post={related as any}
                  variant="compact"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
