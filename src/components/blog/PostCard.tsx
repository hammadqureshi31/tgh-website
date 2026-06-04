import Image from 'next/image'
import Link from 'next/link'
import { BlogPost, Author, Category } from '@/lib/types/database'

type PostWithRelations = BlogPost & {
  author: Pick<Author, 'name' | 'avatar_url'>
  category: Pick<Category, 'name' | 'slug'> | null
}

interface PostCardProps {
  post: PostWithRelations
  variant?: 'default' | 'compact'
  priority?: boolean
}

export default function PostCard({ post, variant = 'default', priority = false }: PostCardProps) {
  const isCompact = variant === 'compact'

  const formattedDate = post.published_at 
    ? new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(post.published_at))
    : ''

  if (isCompact) {
    return (
      <Link href={`/blog/${post.slug}`} className="group flex items-center gap-6 bg-luxury-ivory p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-500 w-full">
        {/* Image */}
        <div className="relative overflow-hidden shrink-0 w-[120px] aspect-video rounded">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              priority={priority}
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="120px"
            />
          ) : (
            <div className="w-full h-full bg-luxury-graphite/10" />
          )}
          <div className="absolute inset-0 bg-luxury-midnight/20 group-hover:bg-luxury-midnight/10 transition-colors duration-500" />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 min-w-0 py-1">
          {post.category && (
             <span
             className="font-mono text-luxury-amber text-[10px] uppercase mb-1.5"
             style={{ letterSpacing: '0.15em' }}
           >
             {post.category.name}
           </span>
          )}
          <h3 className="font-playfair text-lg text-luxury-midnight mb-2 leading-snug group-hover:text-luxury-whiskey transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-3 mt-auto">
             <span className="font-mono text-luxury-graphite/50 text-[10px]" style={{ letterSpacing: '0.1em' }}>
              {formattedDate}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full bg-luxury-ivory p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-500">
      {/* Image */}
      <div className="relative overflow-hidden mb-6 aspect-video shrink-0">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            priority={priority}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-luxury-graphite/10" />
        )}
        <div className="absolute inset-0 bg-luxury-midnight/20 group-hover:bg-luxury-midnight/10 transition-colors duration-500" />
        
        {/* Category Tag */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span
              className="font-mono text-luxury-ivory text-xs uppercase bg-luxury-midnight/60 backdrop-blur-sm px-3 py-1.5"
              style={{ letterSpacing: '0.2em' }}
            >
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="font-playfair text-xl text-luxury-midnight mb-3 leading-snug group-hover:text-luxury-whiskey transition-colors duration-300 line-clamp-2">
        {post.title}
      </h3>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="font-outfit text-luxury-graphite/60 text-sm leading-relaxed mb-6 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* Footer Meta */}
      <div className="mt-auto pt-4 border-t border-luxury-midnight/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
           {post.author?.avatar_url ? (
             <Image
               src={post.author.avatar_url}
               alt={post.author.name}
               width={28}
               height={28}
               className="rounded-full object-cover shrink-0"
             />
           ) : (
             <div className="w-7 h-7 rounded-full bg-luxury-amber/20 flex items-center justify-center shrink-0">
               <span className="font-outfit text-xs text-luxury-amber font-medium">
                 {post.author?.name.charAt(0)}
               </span>
             </div>
           )}
           <span className="font-outfit text-luxury-midnight/80 text-sm font-medium line-clamp-1">
             {post.author?.name}
           </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-luxury-graphite/40 text-[10px]" style={{ letterSpacing: '0.05em' }}>
            {formattedDate}
          </span>
          {post.reading_time && (
            <>
              <span className="w-1 h-1 rounded-full bg-luxury-amber/40" />
              <span className="font-mono text-luxury-graphite/40 text-[10px]" style={{ letterSpacing: '0.05em' }}>
                {post.reading_time} min
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
