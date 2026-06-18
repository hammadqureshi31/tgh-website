'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight, ArrowRight, Clock, Star, CalendarCheck } from 'lucide-react'
import { openBooksyWidget } from '@/lib/utils'
import Image from 'next/image'

const stats = [
  { value: '15', label: 'Expert Services', icon: Star },
  { value: 'From $8', label: 'Starting Price', icon: Star },
  { value: '4.9 ★', label: 'Client Rating', icon: Star },
  { value: 'Same-Day', label: 'Booking Available', icon: CalendarCheck },
]

export default function ServicesHero() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Image */}
        <div className="hidden md:block absolute inset-0 z-0">
          <Image
            src="/about/about-1.jpg"
            alt="The Gentry House Interior"
            fill
            // className="object-contain object-center"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-luxury-midnight/70" />
        </div>
      <div className="max-w-luxury z-20 mx-auto px-6 lg:px-12" ref={ref}>

        {/* Breadcrumb */}
        {/* <nav className="flex items-center gap-2 mb-14" aria-label="Breadcrumb">
          <Link
            href="/"
            className="font-mono text-luxury-pearl/28 text-xs uppercase hover:text-luxury-amber transition-colors duration-300"
            style={{ letterSpacing: '0.12em' }}
          >
            Home
          </Link>
          <ChevronRight size={10} className="text-luxury-pearl/20" />
          <span
            className="font-mono text-luxury-pearl/55 text-xs uppercase"
            style={{ letterSpacing: '0.12em' }}
          >
            Services
          </span>
        </nav> */}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-end">

          {/* Left — headline (3 cols) */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.85 }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-8 h-px bg-luxury-amber" />
                <span
                  className="font-mono text-luxury-amber text-xs uppercase"
                  style={{ letterSpacing: '0.25em' }}
                >
                  What We Offer
                </span>
              </div>

              <h1
                className="font-playfair text-5xl md:text-6xl lg:text-7xl text-luxury-ivory mb-7"
                style={{ lineHeight: '1.04' }}
              >
                Every Service.
                <br />
                <span className="italic text-luxury-amber">Every Detail.</span>
              </h1>

              <p className="font-outfit text-luxury-pearl/50 text-base md:text-lg leading-relaxed mb-12 max-w-lg">
                Fifteen premium grooming services crafted for men who understand that
                how you present yourself is how the world receives you.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={openBooksyWidget}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                  style={{ letterSpacing: '0.12em' }}
                >
                  Book Appointment
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
                <a
                  href="#services-grid"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-luxury-ivory/14 text-luxury-ivory/65 font-outfit text-sm uppercase hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                  style={{ letterSpacing: '0.12em' }}
                >
                  Browse Services
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right — stats (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-2 gap-px bg-luxury-graphite/50"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="bg-luxury-charcoal px-7 py-7">
                <div
                  className="font-playfair text-2xl md:text-3xl text-luxury-amber mb-1.5"
                  style={{ lineHeight: 1 }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-mono text-luxury-pearl/32 text-xs uppercase"
                  style={{ letterSpacing: '0.15em' }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom amber rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent origin-left"
        />
      </div>
    </section>
  )
}