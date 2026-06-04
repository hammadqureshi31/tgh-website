"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import PostCard from "../blog/PostCard";

const post = [
  {
    id: 1,
    category: "GROOMING",
    title: "The Art of the Perfect Shave: A Gentleman's Guide",
    excerpt:
      "Discover the ritual behind a flawless straight-razor shave. From pre-shave preparation to the final cold rinse — every step matters.",
    // image: 'https://images.unsplash.com/photo-1553521041-b7bdc8020f30?w=800&q=80',
    image: "/blog post/post-1.jpg",
    alt: "Luxury shaving accessories on marble surface",
    date: "November 2024",
    readTime: "5 min read",
  },
  {
    id: 2,
    category: "STYLE",
    title: "Face Shape & The Perfect Haircut: Know Yourself",
    excerpt:
      "Understanding your face shape is the foundation of great style. Our master stylists break down the science and art of the perfect cut.",
    // image: 'https://images.unsplash.com/photo-1553521041-b7bdc8020f30?w=800&q=80',
    image: "/blog post/post-2.jpg",
    alt: "Man with sophisticated hairstyle against dark background",
    date: "October 2024",
    readTime: "7 min read",
  },
  {
    id: 3,
    category: "LIFESTYLE",
    title: "Building a Luxury Morning Routine for the Modern Man",
    excerpt:
      "The way you begin your day shapes everything that follows. We explore the habits, rituals, and products that define the groomed modern gentleman.",
    // image: 'https://images.unsplash.com/photo-1553521041-b7bdc8020f30?w=800&q=80',
    image: "/blog post/post-3.jpg",
    alt: "Professional man in a well-lit morning setting",
    date: "September 2024",
    readTime: "6 min read",
  },
];

export default function BlogSection({ featuredPosts }: { featuredPosts?: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="blog"
      className="py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#f8f5f0" }}
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 lg:mb-18"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              From Blog
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-midnight leading-tight max-w-xl"
              style={{ lineHeight: "1.15" }}
            >
              A Good Newspaper Is a Nation
              <span className="italic"> Talking to Itself</span>
            </h2>

            <a
              href="/blog"
              className="group inline-flex items-center gap-2 font-outfit text-luxury-midnight/60 text-sm uppercase tracking-wide border-b border-luxury-midnight/20 pb-1 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 shrink-0"
              style={{ letterSpacing: "0.1em" }}
            >
              View All Articles
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>
          </div>
        </motion.div>
        {featuredPosts && featuredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {featuredPosts.map((post: any, i) => (
              <PostCard key={post.id} post={post as any} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
            {/* Blog Cards Grid */}
            {post.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.15 }}
                className="group cursor-pointer bg-luxury-ivory p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-500"
              >
                {/* Image */}
                <div className="relative overflow-hidden mb-6 aspect-[4/3]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-luxury-midnight/20 group-hover:bg-luxury-midnight/10 transition-colors duration-500" />

                  {/* Category Tag */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="font-mono text-luxury-ivory text-xs uppercase bg-luxury-midnight/60 backdrop-blur-sm px-3 py-1.5"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="font-mono text-luxury-graphite/40 text-xs"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {p.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-luxury-amber/40" />
                  <span
                    className="font-mono text-luxury-graphite/40 text-xs"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {p.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-playfair text-xl text-luxury-midnight mb-3 leading-snug group-hover:text-luxury-whiskey transition-colors duration-300">
                  {p.title}
                </h3>

                {/* Excerpt */}
                <p className="font-outfit text-luxury-graphite/60 text-sm leading-relaxed mb-5">
                  {p.excerpt}
                </p>

                {/* Read More */}
                <div className="flex items-center gap-2 group/link">
                  <span
                    className="font-mono text-luxury-graphite/50 text-xs uppercase group-hover:text-luxury-amber transition-colors duration-300"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    Read More
                  </span>
                  <div className="w-0 group-hover:w-8 h-px bg-luxury-amber transition-all duration-400" />
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
