import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Search, X, ChevronRight, ChevronLeft } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PostCard from "@/components/blog/PostCard";
import { cn } from "@/lib/utils";
import { BlogPost, Author, Category } from "@/lib/types/database";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  return {
    title: "The Journal | The Gentlemen's House",
    description:
      "Grooming guides, style tips, and barbershop culture from The Gentlemen's House.",
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

  /* -----------------------------
   1. Featured Post
------------------------------ */
  const { data: featuredPost, error: featuredError } = await supabase
    .from("blog_posts")
    .select("*, authors(name, avatar_url), categories(name, slug)")
    .eq("status", "published")
    .eq("is_featured", true)
    .lte('published_at', new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

    // console.log("Featured post fetch result:", { featuredPost, featuredError });

  if (featuredError) {
    console.error("[blog/page] featured post fetch error:", featuredError);
  }

  /* -----------------------------
   2. Categories
------------------------------ */
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (categoriesError) {
    console.error("[blog/page] categories fetch error:", categoriesError);
  }

  /* -----------------------------
   3. Posts Query (FIXED CORE ISSUE)
------------------------------ */

  const selectQuery = categorySlug
    ? "*, authors(name, avatar_url), categories!inner(name, slug)"
    : "*, authors(name, avatar_url), categories(name, slug)";

  let query = supabase
    .from("blog_posts")
    .select(selectQuery, { count: "exact" })
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  // category filter
  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  // search filter
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
    <div className="min-h-screen bg-[#F8F5F0] pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        {/* SECTION 1 — Page header */}
        <div className="mb-14 lg:mb-18">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Our Journal
            </span>
          </div>
          <h1
            className="font-playfair text-4xl md:text-5xl lg:text-6xl text-luxury-midnight leading-tight mb-6"
            style={{ lineHeight: "1.15" }}
          >
            The Art of{" "}
            <span className="italic text-luxury-amber">Refinement</span>
          </h1>
          <p className="font-outfit text-luxury-midnight/70 text-base md:text-lg max-w-xl leading-relaxed">
            Grooming insights, style guides, and dispatches from the chair.
            Everything the modern gentleman needs to know.
          </p>
        </div>

        {/* SECTION 2 — Featured post hero */}
        {featured && (
          <div className="relative w-full aspect-[16/9] lg:aspect-[21/9] rounded-lg overflow-hidden mb-16 lg:mb-24 group">
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

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/90 via-luxury-midnight/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/80 via-transparent to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-16">
              <div className="max-w-2xl">
                {featured.category && (
                  <span
                    className="inline-block font-mono text-luxury-ivory text-xs uppercase bg-luxury-amber/80 backdrop-blur-sm px-3 py-1.5 mb-6"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    {featured.category.name}
                  </span>
                )}

                <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory leading-tight mb-4 group-hover:text-luxury-amber transition-colors duration-300 line-clamp-2">
                  {featured.title}
                </h2>

                {featured.excerpt && (
                  <p className="font-outfit text-luxury-pearl/80 text-base md:text-lg leading-relaxed mb-8 line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    {featured.author?.avatar_url ? (
                      <Image
                        src={featured.author.avatar_url}
                        alt={featured.author.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-luxury-amber/20 flex items-center justify-center shrink-0">
                        <span className="font-outfit text-xs text-luxury-amber font-medium">
                          {featured.author?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                    )}
                    <span className="font-outfit text-luxury-ivory text-sm font-medium">
                      {featured.author?.name || 'Anonymous'}
                    </span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-luxury-ivory/30" />
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-luxury-ivory/60 text-xs"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      {formattedFeaturedDate}
                    </span>
                    {featured.reading_time && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-luxury-amber/40" />
                        <span
                          className="font-mono text-luxury-ivory/60 text-xs"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          {featured.reading_time} min
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Link
                  href={`/blog/${featured.slug}`}
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                  style={{ letterSpacing: "0.12em" }}
                >
                  Read Article
                  <ChevronRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3 — Filter bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-luxury-midnight/10 pb-6">
          {/* Tabs */}
          <div className="flex items-center gap-6 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Link
              href={`/blog${search ? `?search=${search}` : ""}`}
              className={cn(
                "font-mono text-xs uppercase whitespace-nowrap transition-colors duration-300",
                !categorySlug
                  ? "text-luxury-amber border-b-2 border-luxury-amber pb-1.5"
                  : "text-luxury-midnight/50 hover:text-luxury-midnight",
              )}
              style={{ letterSpacing: "0.15em" }}
            >
              All Articles
            </Link>
            {categories?.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}${search ? `&search=${search}` : ""}`}
                className={cn(
                  "font-mono text-xs uppercase whitespace-nowrap transition-colors duration-300",
                  categorySlug === cat.slug
                    ? "text-luxury-amber border-b-2 border-luxury-amber pb-1.5"
                    : "text-luxury-midnight/50 hover:text-luxury-midnight",
                )}
                style={{ letterSpacing: "0.15em" }}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <form className="relative flex items-center w-full md:w-64 shrink-0">
            {categorySlug && (
              <input type="hidden" name="category" value={categorySlug} />
            )}
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search articles..."
              className="w-full bg-white border border-luxury-midnight/10 px-4 py-2.5 pr-10 font-outfit text-sm text-luxury-midnight focus:outline-none focus:border-luxury-amber transition-colors rounded-sm"
            />
            {search ? (
              <Link
                href={`/blog${categorySlug ? `?category=${categorySlug}` : ""}`}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-midnight/40 hover:text-luxury-midnight"
              >
                <X size={16} />
              </Link>
            ) : (
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-midnight/40 hover:text-luxury-midnight"
              >
                <Search size={16} />
              </button>
            )}
          </form>
        </div>

        {/* SECTION 4 — Posts grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {posts.map((post: any, i) => (
              <PostCard key={post.id} post={post as any} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-luxury-midnight/10 border-dashed rounded-lg bg-white/50">
            <Search size={48} className="text-luxury-midnight/20 mb-6" />
            <h3 className="font-playfair text-2xl text-luxury-midnight mb-3">
              No articles found
            </h3>
            <p className="font-outfit text-luxury-midnight/60 mb-6 max-w-md">
              {search
                ? `We couldn't find any articles matching "${search}". Try adjusting your search or filters.`
                : "There are currently no articles in this category."}
            </p>
            {(search || categorySlug) && (
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 border border-luxury-amber text-luxury-amber font-outfit text-sm uppercase tracking-wide hover:bg-luxury-amber hover:text-luxury-midnight transition-all duration-300"
                style={{ letterSpacing: "0.1em" }}
              >
                Clear Filters
              </Link>
            )}
          </div>
        )}

        {/* SECTION 5 — Pagination */}
        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-2">
            {page > 1 ? (
              <Link
                href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 text-luxury-midnight/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110 mr-4"
              >
                <ChevronLeft size={18} />
              </Link>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/5 text-luxury-midnight/20 mr-4 cursor-not-allowed">
                <ChevronLeft size={18} />
              </div>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/blog?page=${p}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                className={cn(
                  "w-10 h-10 flex items-center justify-center font-mono text-sm transition-all duration-300",
                  p === page
                    ? "bg-luxury-amber text-luxury-midnight font-bold"
                    : "text-luxury-midnight/60 hover:bg-luxury-midnight/5 hover:text-luxury-midnight",
                )}
              >
                {p}
              </Link>
            ))}

            {page < totalPages ? (
              <Link
                href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ""}${search ? `&search=${search}` : ""}`}
                className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/10 text-luxury-midnight/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110 ml-4"
              >
                <ChevronRight size={18} />
              </Link>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center border border-luxury-midnight/5 text-luxury-midnight/20 ml-4 cursor-not-allowed">
                <ChevronRight size={18} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
