'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Script from 'next/script'

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])

  return (
    <section
      id="testimonials"
      ref={containerRef}
      className="relative overflow-hidden py-12 md:py-20 bg-luxury-ivory"
      aria-label="Customer testimonials"
    >
      {/* Parallax Background */}
      {/* <motion.div className="absolute inset-0 scale-110" style={{ y: backgroundY }}>
        <Image
          src="/home/testimonial.jpg" 
          alt="Luxury dark interior background"
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
      </motion.div> */}

      {/* Dark overlays for cinematic depth */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-luxury-midnight/40 via-transparent to-luxury-midnight/40" /> */}

      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent" /> */}

      {/* Content */}
      {/* <div className="relative z-10 max-w-luxury mx-auto px-6 lg:px-12"> */}

        {/* Section Header */}
        {/* <motion.div
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
        </motion.div> */}

        {/* Elfsight Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-6xl mx-auto"
        >
          {/* Elfsight Google Reviews | Untitled Google Reviews */}
          <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
          <div className="elfsight-app-99671168-ece6-41d6-8f2d-bd598ee1e8a7" data-elfsight-app-lazy></div>
        </motion.div>
      {/* </div> */}
    </section>
  )
}
