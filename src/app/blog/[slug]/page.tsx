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
    return { title: "Post Not Found | The Gentry House" }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt || ''

  return {
    title: `${title} | The Gentry House`,
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
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  /* ── Fetch Post ───────────────────────────────────────────── */
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

  /* ── Fetch Related Posts ──────────────────────────────────── */
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

  /* ── Parse HTML for ToC ───────────────────────────────────── */
  let updatedContent = post.content || ''
  const headings: { id: string; text: string; level: 2 | 3 }[] = []

  updatedContent = updatedContent.replace(
    /<h([23])[^>]*>(.*?)<\/h\1>/gi,
    (match: string, levelStr: string, textContent: string) => {
      const text = textContent.replace(/<[^>]+>/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      const level = parseInt(levelStr, 10) as 2 | 3

      let finalId = id
      let counter = 1
      while (headings.find((h) => h.id === finalId)) {
        finalId = `${id}-${counter}`
        counter++
      }

      headings.push({ id: finalId, text, level })
      return `<h${level} id="${finalId}">${textContent}</h${level}>`
    }
  )

  const formattedDate = post.published_at
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(post.published_at))
    : ''

  return (
    <div className="min-h-screen pt-24 pb-32" style={{ backgroundColor: '#F8F5F0' }}>

      {/* ── SECTION 1: Breadcrumb ───────────────────────────── */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-10">
        <nav
          className="flex items-center gap-2"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="font-mono text-luxury-midnight/30 text-xs uppercase hover:text-luxury-amber transition-colors duration-300"
            style={{ letterSpacing: '0.12em' }}
          >
            Home
          </Link>
          <ChevronRight size={10} className="text-luxury-midnight/20" />
          <Link
            href="/blog"
            className="font-mono text-luxury-midnight/30 text-xs uppercase hover:text-luxury-amber transition-colors duration-300"
            style={{ letterSpacing: '0.12em' }}
          >
            Journal
          </Link>
          <ChevronRight size={10} className="text-luxury-midnight/20" />
          <span
            className="font-mono text-luxury-midnight/60 text-xs uppercase truncate max-w-[180px] sm:max-w-[320px]"
            style={{ letterSpacing: '0.12em' }}
          >
            {post.title}
          </span>
        </nav>
      </div>

      {/* ── SECTION 2: Hero Image ───────────────────────────── */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="relative w-full overflow-hidden aspect-[16/9] lg:aspect-[18/9]">
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
          {/* Thin amber top edge */}
          <div className="absolute top-0 left-0 right-0 h-px bg-luxury-amber/40" />
        </div>
      </div>

      {/* ── Main Content Grid ───────────────────────────────── */}
      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 relative">

          {/* ── Sidebar: Table of Contents ──────────────────── */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-28">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-px bg-luxury-amber" />
                <span
                  className="font-mono text-luxury-amber text-xs uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Contents
                </span>
              </div>
              <TableOfContents headings={headings} />
            </div>
          </div>

          {/* ── Article Column ──────────────────────────────── */}
          <article className=" lg:col-span-10 lg:col-start-4 xl:col-start-4 xl:col-span-10 max-w-[1000px] mx-auto w-full">

            {/* ── SECTION 3: Article Header ─────────────────── */}
            <header className="mb-14 pb-10 border-b border-luxury-midnight/10">

              {/* Category */}
              {post.categories && (
                <Link
                  href={`/blog?category=${post.categories.slug}`}
                  className="inline-flex items-center gap-2 mb-7 group"
                >
                  <div className="w-5 h-px bg-luxury-amber" />
                  <span
                    className="font-mono text-luxury-amber text-xs uppercase group-hover:text-luxury-whiskey transition-colors duration-300"
                    style={{ letterSpacing: '0.22em' }}
                  >
                    {post.categories.name}
                  </span>
                </Link>
              )}

              {/* Title */}
              <h1
                className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-midnight mb-6"
                style={{ lineHeight: '1.15' }}
              >
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="font-outfit text-luxury-midnight/55 text-lg md:text-xl leading-relaxed mb-10">
                  {post.excerpt}
                </p>
              )}

              {/* Author + meta */}
              <div className="flex items-center gap-4 pt-6 border-t border-luxury-midnight/5">
                {/* Avatar */}
                {post.authors?.avatar_url ? (
                  <div className="w-10 h-10 overflow-hidden border border-luxury-midnight/10 shrink-0">
                    <Image
                      src={post.authors.avatar_url}
                      alt={post.authors.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-luxury-amber/10 border border-luxury-amber/20 flex items-center justify-center shrink-0">
                    <span className="font-mono text-sm text-luxury-amber">
                      {post.authors?.name?.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <span className="font-outfit text-luxury-midnight text-sm font-medium">
                    {post.authors?.name}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="font-mono text-luxury-midnight/35 text-xs"
                      style={{ letterSpacing: '0.1em' }}
                    >
                      {formattedDate}
                    </span>
                    {post.reading_time && (
                      <>
                        <span className="w-1 h-1 bg-luxury-amber/40" />
                        <span
                          className="font-mono text-luxury-midnight/35 text-xs"
                          style={{ letterSpacing: '0.1em' }}
                        >
                          {post.reading_time} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>

            {/* ── SECTION 4: Article Body ───────────────────── */}
            <div className="text-luxury-midnight text-wrap overflow-hidden"
              // className={cn(
              //   'text-luxury-midnight text-wrap overflow-hidden',
              //   // Paragraphs
              //   '[&>p]:font-outfit [&>p]:text-base [&>p]:md:text-[17px] [&>p]:leading-[1.9] [&>p]:text-luxury-midnight/75 [&>p]:mb-8 [&>p]:text-wrap',
              //   // H2
              //   '[&>h2]:font-playfair [&>h2]:text-2xl [&>h2]:md:text-3xl [&>h2]:text-luxury-midnight [&>h2]:mt-16 [&>h2]:mb-6 [&>h2]:pb-4 [&>h2]:border-b [&>h2]:border-luxury-midnight/8',
              //   // H3
              //   '[&>h3]:font-playfair [&>h3]:text-xl [&>h3]:md:text-2xl [&>h3]:italic [&>h3]:text-luxury-midnight [&>h3]:mt-12 [&>h3]:mb-4',
              //   // Lists
              //   '[&>ul]:font-outfit [&>ul]:text-luxury-midnight/70 [&>ul]:mb-8 [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:mb-4 [&>ul>li]:leading-[1.85] [&>ul>li]:pl-5 [&>ul>li]:relative',
              //   '[&>ul>li]:before:content-["–"] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-luxury-amber',
              //   '[&>ol]:font-outfit [&>ol]:text-luxury-midnight/70 [&>ol]:mb-8 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-3 [&>ol>li]:leading-[1.85]',
              //   // Blockquote
              //   '[&>blockquote]:border-l-2 [&>blockquote]:border-luxury-amber [&>blockquote]:pl-6 [&>blockquote]:md:pl-10 [&>blockquote]:py-1 [&>blockquote]:my-12 [&>blockquote]:bg-luxury-midnight/[0.02]',
              //   '[&>blockquote>p]:font-playfair [&>blockquote>p]:text-xl [&>blockquote>p]:md:text-2xl [&>blockquote>p]:italic [&>blockquote>p]:text-luxury-midnight [&>blockquote>p]:leading-relaxed [&>blockquote>p]:mb-0',
              //   // Images — sharp, no border-radius
              //   '[&>img]:w-full [&>img]:my-12',
              //   // Figures
              //   '[&>figure]:my-12 [&>figure>img]:w-full',
              //   '[&>figcaption]:text-center [&>figcaption]:font-mono [&>figcaption]:text-xs [&>figcaption]:text-luxury-midnight/40 [&>figcaption]:mt-4 [&>figcaption]:tracking-wider',
              //   // Links
              //   '[&_a]:text-luxury-amber [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-luxury-whiskey [&_a]:transition-colors [&_a]:duration-300',
              //   // Code
              //   '[&_code]:font-mono [&_code]:text-[0.88em] [&_code]:bg-luxury-midnight/6 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-luxury-midnight',
              //   '[&>pre]:bg-luxury-midnight/5 [&>pre]:border [&>pre]:border-luxury-midnight/8 [&>pre]:p-6 [&>pre]:overflow-x-auto [&>pre]:mb-8 [&>pre]:font-mono [&>pre]:text-sm',
              //   '[&>pre_code]:bg-transparent [&>pre_code]:p-0 [&>pre_code]:text-luxury-midnight',
              //   // Horizontal rule
              //   '[&>hr]:border-0 [&>hr]:h-px [&>hr]:bg-luxury-midnight/10 [&>hr]:my-12',
              //   // Strong / em
              //   '[&_strong]:text-luxury-midnight [&_strong]:font-semibold',
              //   '[&_em]:italic [&_em]:text-luxury-midnight/80',
              // )}
            >
              <div dangerouslySetInnerHTML={{ __html: updatedContent }} />
            </div>

            {/* ── SECTION 5: Share Row ──────────────────────── */}
            <div className="mt-16 pt-8 border-t border-luxury-midnight/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-px bg-luxury-amber" />
                <span
                  className="font-mono text-luxury-midnight/35 text-xs uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  Share this article
                </span>
              </div>
              <ShareButtons title={post.title} />
            </div>

            {/* ── SECTION 6: Author Bio Card ────────────────── */}
            {post.authors && (
              <div className="mt-12 border border-luxury-midnight/10 bg-white">
                {/* Amber top accent */}
                <div className="h-px bg-luxury-amber/40" />
                <div className="p-8 md:p-10 flex flex-col md:flex-row items-start gap-6">

                  {/* Avatar */}
                  {post.authors.avatar_url ? (
                    <div className="w-16 h-16 overflow-hidden border border-luxury-midnight/10 shrink-0">
                      <Image
                        src={post.authors.avatar_url}
                        alt={post.authors.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-luxury-amber/10 border border-luxury-amber/20 flex items-center justify-center shrink-0">
                      <span className="font-playfair text-2xl text-luxury-amber">
                        {post.authors.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div>
                    <span
                      className="block font-mono text-luxury-amber/60 text-xs uppercase mb-2"
                      style={{ letterSpacing: '0.2em' }}
                    >
                      About the Author
                    </span>
                    <h3 className="font-playfair text-xl text-luxury-midnight mb-3">
                      {post.authors.name}
                    </h3>
                    {post.authors.bio && (
                      <p className="font-outfit text-luxury-midnight/55 text-sm leading-relaxed max-w-lg">
                        {post.authors.bio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>

        {/* ── SECTION 7: Related Articles ───────────────────── */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 md:mt-32 pt-16 md:pt-24 border-t border-luxury-midnight/10">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-px bg-luxury-amber" />
                  <span
                    className="font-mono text-luxury-amber text-xs uppercase"
                    style={{ letterSpacing: '0.25em' }}
                  >
                    Continue Reading
                  </span>
                </div>
                <h2
                  className="font-playfair text-2xl md:text-3xl text-luxury-midnight"
                  style={{ lineHeight: '1.2' }}
                >
                  More from the{' '}
                  <span className="italic">Journal</span>
                </h2>
              </div>

              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 font-outfit text-luxury-midnight/50 text-sm uppercase border-b border-luxury-midnight/15 pb-1 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 shrink-0"
                style={{ letterSpacing: '0.1em' }}
              >
                All Articles
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {relatedPosts.map((related) => (
                <PostCard key={related.id} post={related as any} variant="compact" />
              ))}
            </div>
          </div>
        )}

        {/* Back to Journal link */}
        <div className="mt-16 pt-10 border-t border-luxury-midnight/10 flex justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 font-outfit text-luxury-midnight/40 text-sm uppercase hover:text-luxury-amber transition-colors duration-300"
            style={{ letterSpacing: '0.12em' }}
          >
            <span className="w-6 h-px bg-luxury-midnight/30 group-hover:bg-luxury-amber group-hover:w-10 transition-all duration-300" />
            Back to Journal
          </Link>
        </div>
      </div>
    </div>
  )
}