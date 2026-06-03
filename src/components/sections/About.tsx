'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const stats = [
  { value: '12+', label: 'Years of Craft' },
  { value: '648+', label: 'Happy Clients' },
  { value: '4.9', label: 'Average Rating' },
]

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="bg-luxury-ivory py-24 md:py-32 overflow-hidden">
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-2 lg:order-1"
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: '0.25em' }}
              >
                Our Story
              </span>
            </div>

            {/* TGH Logo Mark */}
            <div className="mb-6">
              <span
                className="font-playfair text-luxury-amber text-6xl font-bold"
                style={{ letterSpacing: '-0.02em' }}
              >
                TGH
              </span>
            </div>

            {/* Heading */}
            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-midnight leading-tight mb-6"
              style={{ lineHeight: '1.15' }}
            >
              Redefining the Art of
              <span className="italic"> Gentry </span>
              Grooming
            </h2>

            {/* Body */}
            <p className="font-outfit text-luxury-graphite/70 text-base leading-relaxed mb-6">
              The Gentry House was born from a singular conviction: that every man
              deserves an exceptional grooming experience. We&apos;re not a barbershop — we&apos;re
              a sanctuary where craft meets luxury, where every detail is considered.
            </p>
            <p className="font-outfit text-luxury-graphite/70 text-base leading-relaxed mb-10">
              Our master stylists blend decades of technique with contemporary vision,
              delivering results that speak for themselves. From the warm welcome to the
              final flourish, every visit is a moment worth savouring.
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10 border-t border-luxury-pearl pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-outfit text-3xl font-bold text-luxury-midnight">{stat.value}</div>
                  <div className="font-mono text-luxury-graphite/50 text-xs mt-1 uppercase" style={{ letterSpacing: '0.15em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => handleNavClick('#services')}
              className="group inline-flex items-center gap-3 text-luxury-midnight font-outfit font-medium text-sm uppercase tracking-wide border-b border-luxury-midnight pb-1 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
              style={{ letterSpacing: '0.12em' }}
            >
              Explore Our Services
              <ArrowRight
                size={16}
                className="group-hover:translate-x-2 transition-transform duration-300"
              />
            </button>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2 relative"
          >
            {/* Decorative border offset */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-luxury-amber/20 z-0" />
            <div className="relative z-10 aspect-[4/5] overflow-hidden">
              <Image
                // src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=900&q=80"
                src="/about/about-us-cm.jpg"
                alt="Luxury grooming studio interior with warm lighting and premium furnishings"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/20 to-transparent" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-luxury-midnight px-6 py-5 border-l-2 border-luxury-amber">
              <div className="font-mono text-luxury-amber text-xs uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
                Est. 2025
              </div>
              <div className="font-playfair text-luxury-ivory text-lg italic">
                Trusted by Thousands
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
