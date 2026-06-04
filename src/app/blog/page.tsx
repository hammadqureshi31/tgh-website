import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Search, X, ChevronRight, ChevronLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PostCard from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";
import { BlogPost, Author, Category } from "@/lib/types/database";
import Header from "@/components/Header";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "The Journal | The Gentry House",
    description:
      "Grooming guides, style tips, and barbershop culture from The Gentry House.",
    openGraph: {
      type: "website",
    },
  };
}

export default async function BlogPage({ searchParams }: Props) {
  const { page: pageStr, category: categorySlug, search } = await searchParams;

  const page = pageStr ? Math.max(parseInt(pageStr, 10) || 1, 1) : 1;
  const pageSize = 12;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createServerSupabaseClient();

  /* ── 1. Featured Post ─────────────────────────────────────── */
  const { data: featuredPost, error: featuredError } = await supabase
    .from("blog_posts")
    .select("*, authors(name, avatar_url), categories(name, slug)")
    .eq("status", "published")
    .eq("is_featured", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (featuredError) {
    console.error("[blog/page] featured post fetch error:", featuredError);
  }

  /* ── 2. Categories ────────────────────────────────────────── */
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (categoriesError) {
    console.error("[blog/page] categories fetch error:", categoriesError);
  }

  /* ── 3. Posts Query ───────────────────────────────────────── */
  const selectQuery = categorySlug
    ? "*, authors(name, avatar_url), categories!inner(name, slug)"
    : "*, authors(name, avatar_url), categories(name, slug)";

  let query = supabase
    .from("blog_posts")
    .select(selectQuery, { count: "exact" })
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  if (search) {
    const searchTerm = `%${search}%`;
    query = query.or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm}`);
  }

  const { data: posts, error: postsError, count } = await query.range(from, to);

  if (postsError) {
    console.error("[blog/page] posts fetch error:", postsError);
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 0;

  const featured = featuredPost as
    | (BlogPost & {
        author: Pick<Author, "name" | "avatar_url">;
        category: Pick<Category, "name" | "slug"> | null;
      })
    | null;

  const formattedFeaturedDate = featured?.published_at
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(featured.published_at))
    : "";

  return (
    <>
      // <Header />
      <div
        className="min-h-screen pt-24 md:pt-12 pb-24 md:pb-32"
        style={{ backgroundColor: "#F8F5F0" }}
      >
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          {/* ── SECTION 1: Page Header ─────────────────────────── */}
          <div className="mb-16 lg:mb-20">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: "0.25em" }}
              >
                Our Journal
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <h1
                className="font-playfair text-4xl md:text-5xl lg:text-6xl text-luxury-midnight"
                style={{ lineHeight: "1.1" }}
              >
                The Art of{" "}
                <span className="italic text-luxury-amber">Refinement</span>
              </h1>
              <p className="font-outfit text-luxury-midnight/50 text-sm max-w-xs leading-relaxed lg:text-right">
                Grooming insights, style guides, and dispatches from the chair.
                Everything the modern gentleman needs to know.
              </p>
            </div>
          </div>

          {/* ── SECTION 2: Featured Post Hero ─────────────────── */}
          {featured && (
            <div className="relative w-full overflow-hidden mb-16 lg:mb-24 group aspect-[16/9] lg:aspect-[21/9]">
              {featured.featured_image ? (
                <Image
                  src={featured.featured_image}
                  alt={featured.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  sizes="(max-width: 1024px) 100vw, 1400px"
                />
              ) : (
                <div className="w-full h-full bg-luxury-graphite" />
              )}

              {/* Cinematic overlays */}
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/90 via-luxury-midnight/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/80 via-transparent to-transparent" />

              {/* Top amber edge */}
              <div className="absolute top-0 left-0 right-0 h-px bg-luxury-amber/30" />

              {/* Featured label — top-right */}
              <div className="absolute top-8 right-8">
                <div className="border border-luxury-ivory/20 px-4 py-2 backdrop-blur-sm">
                  <span
                    className="font-mono text-luxury-ivory/60 text-xs uppercase"
                    style={{ letterSpacing: "0.25em" }}
                  >
                    Featured
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
                <div className="max-w-2xl">
                  {/* Category badge */}
                  {featured.category && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-5 h-px bg-luxury-amber" />
                      <span
                        className="font-mono text-luxury-amber text-xs uppercase"
                        style={{ letterSpacing: "0.2em" }}
                      >
                        {featured.category.name}
                      </span>
                    </div>
                  )}

                  <h2
                    className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory mb-4 group-hover:text-luxury-amber transition-colors duration-500 line-clamp-2"
                    style={{ lineHeight: "1.15" }}
                  >
                    {featured.title}
                  </h2>

                  {featured.excerpt && (
                    <p className="font-outfit text-luxury-pearl/70 text-base md:text-lg leading-relaxed mb-8 line-clamp-2 max-w-xl">
                      {featured.excerpt}
                    </p>
                  )}

                  {/* Author + meta row */}
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                      {featured.author?.avatar_url ? (
                        <div className="w-8 h-8 overflow-hidden border border-luxury-ivory/20 shrink-0">
                          <Image
                            src={featured.author.avatar_url}
                            alt={featured.author.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-luxury-amber/20 border border-luxury-amber/30 flex items-center justify-center shrink-0">
                          <span className="font-mono text-xs text-luxury-amber">
                            {featured.author?.name?.charAt(0) || "A"}
                          </span>
                        </div>
                      )}
                      <span className="font-outfit text-luxury-ivory/80 text-sm">
                        {featured.author?.name || "Anonymous"}
                      </span>
                    </div>

                    <div className="w-px h-3 bg-luxury-ivory/20" />

                    <span
                      className="font-mono text-luxury-ivory/40 text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      {formattedFeaturedDate}
                    </span>

                    {featured.reading_time && (
                      <>
                        <span className="w-1 h-1 bg-luxury-amber/40" />
                        <span
                          className="font-mono text-luxury-ivory/40 text-xs"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          {featured.reading_time} min read
                        </span>
                      </>
                    )}
                  </div>

                  <Link
                    href={`/blog/${featured.slug}`}
                    className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                    style={{ letterSpacing: "0.12em" }}
                  >
                    Read Article
                    <ChevronRight
                      size={14}
                      className="group-hover/btn:translate-x-1 transition-transform duration-300"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── SECTION 3: Filter Bar ──────────────────────────── */}
          <div className="mb-12">
            {/* Top rule */}
            <div className="h-px bg-luxury-midnight/10 mb-8" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Category Tabs */}
              <nav
                className="flex items-center gap-0 overflow-x-auto w-full md:w-auto"
                aria-label="Blog categories"
              >
                <Link
                  href={`/blog${search ? `?search=${search}` : ""}`}
                  className={cn(
                    "font-mono text-xs uppercase whitespace-nowrap transition-all duration-300 px-4 py-3 border-b-2",
                    !categorySlug
                      ? "border-luxury-amber text-luxury-midnight"
                      : "border-transparent text-luxury-midnight/40 hover:text-luxury-midnight hover:border-luxury-midnight/20",
                  )}
                  style={{ letterSpacing: "0.15em" }}
                >
                  All
                </Link>
                {categories?.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/blog?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                    className={cn(
                      "font-mono text-xs uppercase whitespace-nowrap transition-all duration-300 px-4 py-3 border-b-2",
                      categorySlug === cat.slug
                        ? "border-luxury-amber text-luxury-midnight"
                        : "border-transparent text-luxury-midnight/40 hover:text-luxury-midnight hover:border-luxury-midnight/20",
                    )}
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>

              {/* Search */}
              <form className="relative flex items-center w-full md:w-64 shrink-0">
                {categorySlug && (
                  <input type="hidden" name="category" value={categorySlug} />
                )}
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder="Search articles…"
                  className="w-full bg-white border border-luxury-midnight/10 px-4 py-2.5 pr-10 font-outfit text-sm text-luxury-midnight placeholder:text-luxury-midnight/30 focus:outline-none focus:border-luxury-amber transition-colors duration-300"
                />
                {search ? (
                  <Link
                    href={`/blog${categorySlug ? `?category=${categorySlug}` : ""}`}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-midnight/30 hover:text-luxury-amber transition-colors duration-300"
                  >
                    <X size={14} />
                  </Link>
                ) : (
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-midnight/30 hover:text-luxury-amber transition-colors duration-300"
                  >
                    <Search size={14} />
                  </button>
                )}
              </form>
            </div>

            {/* Bottom rule */}
            <div className="h-px bg-luxury-midnight/10 mt-0" />
          </div>

          {/* ── SECTION 4: Posts Grid ─────────────────────────── */}
          {posts && posts.length > 0 ? (
            <>
              {/* Result count */}
              {(search || categorySlug) && (
                <p
                  className="font-mono text-luxury-midnight/30 text-xs uppercase mb-8"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {count} {count === 1 ? "Article" : "Articles"} found
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {posts.map((post: any, i) => (
                  <PostCard key={post.id} post={post as any} priority={i < 3} />
                ))}
              </div>
            </>
          ) : (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center border border-dashed border-luxury-midnight/15 bg-white/40">
              <div className="w-12 h-12 border border-luxury-midnight/10 flex items-center justify-center mb-8">
                <Search size={18} className="text-luxury-midnight/20" />
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-luxury-amber/40" />
                <span
                  className="font-mono text-luxury-amber/50 text-xs uppercase"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Nothing here
                </span>
                <div className="w-6 h-px bg-luxury-amber/40" />
              </div>

              <h3 className="font-playfair text-2xl text-luxury-midnight mb-3">
                No Articles Found
              </h3>
              <p className="font-outfit text-luxury-midnight/50 text-sm leading-relaxed mb-8 max-w-sm">
                {search
                  ? `We couldn't find any articles matching "${search}". Try adjusting your search or explore all articles.`
                  : "There are currently no articles in this category. Check back soon."}
              </p>
              {(search || categorySlug) && (
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-3 px-8 py-4 border border-luxury-midnight/20 text-luxury-midnight font-outfit text-sm uppercase hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                  style={{ letterSpacing: "0.1em" }}
                >
                  Clear Filters
                </Link>
              )}
            </div>
          )}

          {/* ── SECTION 5: Pagination ─────────────────────────── */}
          {totalPages > 1 && (
            <div className="mt-20 pt-10 border-t border-luxury-midnight/10">
              <div className="flex justify-center items-center gap-1">
                {/* Prev */}
                {page > 1 ? (
                  <Link
                    href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                    className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 text-luxury-midnight/50 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 mr-4"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/5 text-luxury-midnight/15 mr-4 cursor-not-allowed">
                    <ChevronLeft size={16} />
                  </div>
                )}

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center font-mono text-xs transition-all duration-300",
                        p === page
                          ? "bg-luxury-midnight text-luxury-ivory"
                          : "text-luxury-midnight/40 hover:bg-luxury-midnight/5 hover:text-luxury-midnight border border-transparent hover:border-luxury-midnight/10",
                      )}
                      style={{ letterSpacing: "0.05em" }}
                      aria-label={`Page ${p}`}
                      aria-current={p === page ? "page" : undefined}
                    >
                      {String(p).padStart(2, "0")}
                    </Link>
                  ),
                )}

                {/* Next */}
                {page < totalPages ? (
                  <Link
                    href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                    className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 text-luxury-midnight/50 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 ml-4"
                    aria-label="Next page"
                  >
                    <ChevronRight size={16} />
                  </Link>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/5 text-luxury-midnight/15 ml-4 cursor-not-allowed">
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>

              {/* Page X of Y */}
              <p
                className="text-center font-mono text-luxury-midnight/25 text-xs mt-4"
                style={{ letterSpacing: "0.15em" }}
              >
                Page {String(page).padStart(2, "0")} of{" "}
                {String(totalPages).padStart(2, "0")}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
