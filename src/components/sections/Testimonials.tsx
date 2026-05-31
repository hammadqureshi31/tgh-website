'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    quote:
      'TGH completely redefined what a grooming experience means to me. The precision, the atmosphere, the attention to every detail — it\'s unlike anything I\'ve ever experienced at a traditional barbershop.',
    name: 'James Thornton',
    title: 'Creative Director',
    rating: 5,
  },
  {
    id: 2,
    quote:
      'I\'ve been to barbershops in London, New York, and Milan. The Gentlemen\'s House stands among the finest. Every visit feels like a ritual. My confidence walks in before I do.',
    name: 'Marcus Williams',
    title: 'Investment Banker',
    rating: 5,
  },
  {
    id: 3,
    quote:
      'The Executive Package changed how I prepare for boardroom meetings. When you look exceptional, you think exceptionally. TGH understands the psychology of grooming at the highest level.',
    name: 'Daniel Ashford',
    title: 'Managing Director',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(next, 7000)
    return () => clearInterval(interval)
  }, [next])

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative overflow-hidden py-32 md:py-40"
      aria-label="Customer testimonials"
    >
      {/* Parallax Background */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: backgroundY }}>
        <Image
          // src="https://images.unsplash.com/photo-1553521041-b7bdc8020f30?w=1920&q=80" 
          src="/home/testimonial.jpg" 
          alt="Luxury dark interior background"
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
      </motion.div>

      {/* Dark overlays for cinematic depth */}
      {/* <div className="absolute inset-0 bg-luxury-midnight/75" /> */}
      <div className="absolute inset-0 bg-gradient-to-b from-luxury-midnight/40 via-transparent to-luxury-midnight/40" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-luxury mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              Client Stories
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl text-luxury-ivory">
            What Our Gentlemen Say
          </h2>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Quote Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <Quote size={32} className="text-luxury-amber/40" />
          </motion.div>

          {/* Quote Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonials[current].id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Stars */}
              <div className="flex justify-center gap-1.5 mb-8">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-luxury-amber text-luxury-amber" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-playfair text-xl md:text-2xl lg:text-3xl text-luxury-ivory leading-relaxed mb-10 italic">
                &ldquo;{testimonials[current].quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-px bg-luxury-amber/40 mb-3" />
                <p className="font-outfit font-medium text-luxury-ivory tracking-wide">
                  {testimonials[current].name}
                </p>
                <p
                  className="font-mono text-luxury-amber/60 text-xs uppercase"
                  style={{ letterSpacing: '0.2em' }}
                >
                  {testimonials[current].title}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex items-center justify-center gap-3 mt-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === current
                    ? 'w-6 h-1.5 bg-luxury-amber'
                    : 'w-1.5 h-1.5 bg-luxury-ivory/20 hover:bg-luxury-ivory/40'
                }`}
                aria-label={`Testimonial ${i + 1}`}
                aria-current={i === current}
              />
            ))}
          </div>

          {/* Prev/Next */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="font-mono underline text-luxury-amber text-xs uppercase hover:text-luxury-amber transition-colors duration-300"
              style={{ letterSpacing: '0.2em' }}
            >
              ← Prev
            </button>
            <span className="text-luxury-graphite/40">|</span>
            <button
              onClick={next}
              className="font-mono underline text-luxury-amber text-xs uppercase hover:text-luxury-amber transition-colors duration-300"
              style={{ letterSpacing: '0.2em' }}
            >
              Next →
            </button>
          </div>
        </div>

        {/* Rating Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 pt-12 border-t border-luxury-ivory/10 grid grid-cols-3 gap-8 max-w-lg mx-auto text-center"
        >
          {[
            { value: '4.9★', label: 'Google Rating' },
            { value: '648+', label: 'Happy Clients' },
            { value: '98%', label: 'Satisfaction' },
          ].map((item) => (
            <div key={item.label}>
              <div className="font-outfit text-2xl text-luxury-amber">{item.value}</div>
              <div
                className="font-mono text-luxury-pearl/40 text-xs mt-1 uppercase"
                style={{ letterSpacing: '0.15em' }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
