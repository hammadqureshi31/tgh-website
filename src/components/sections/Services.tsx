'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scissors, Sparkles, User, Wand2, Layers, Crown } from 'lucide-react'

const services = [
  {
    id: 1,
    icon: Scissors,
    title: 'Classic Haircut',
    description:
      'Timeless precision cuts tailored to your face shape, lifestyle, and personal aesthetic.',
  },
  {
    id: 2,
    icon: Wand2,
    title: 'Modern Styling',
    description:
      'Contemporary looks executed with editorial precision using premium styling products.',
  },
  {
    id: 3,
    icon: User,
    title: 'Beard Sculpting',
    description:
      'Artisan beard design and maintenance — from clean lines to full sculpted statements.',
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Luxury Shave',
    description:
      'The ritual of a traditional hot-towel straight razor shave, elevated for the modern gentleman.',
  },
  {
    id: 5,
    icon: Layers,
    title: 'Facial Grooming',
    description:
      'Restorative skincare treatments designed specifically for men who demand the best.',
  },
  {
    id: 6,
    icon: Crown,
    title: 'Executive Package',
    description:
      'Our signature experience — haircut, shave, facial, and styling. The complete gentleman.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="services" className="bg-[#F8F5F0] py-24 md:py-32 overflow-hidden">
      <div className="max-w-luxury mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              What We Offer
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>

          <h2
            className="font-playfair text-3xl md:text-5xl text-luxury-charcoal mb-6"
            style={{ lineHeight: '1.2' }}
          >
            Services Crafted for
            <span className="italic text-luxury-amber"> Discerning </span>
            Gentlemen
          </h2>

          <p className="font-outfit text-luxury-charcoal/70 text-base max-w-xl mx-auto leading-relaxed">
            Each service is a carefully choreographed ritual, delivered by master craftsmen
            using only the finest products available.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px lg:gap-5 "
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.article
                key={service.id}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group bg-luxury-ivory p-8 lg:p-10 cursor-default hover:bg-luxury-graphite transition-colors duration-500 relative overflow-hidden"
              >
                {/* Amber accent on hover */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-luxury-amber group-hover:w-full transition-all duration-500" />

                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-luxury-amber group-hover:border-luxury-amber/40 transition-colors duration-500">
                    <Icon
                      size={20}
                      className="text-luxury-charcoal group-hover:text-luxury-amber transition-colors duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-playfair text-xl text-luxury-charcoal mb-3 group-hover:text-luxury-amber transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="font-outfit text-luxury-amber text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Arrow on hover */}
                <div className="mt-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="font-mono text-luxury-amber text-xs uppercase" style={{ letterSpacing: '0.15em' }}>
                    Learn more
                  </span>
                  <div className="w-4 h-px bg-luxury-amber" />
                </div>
              </motion.article>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-14"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-3 px-10 py-4 border border-luxury-amber text-luxury-amber font-outfit text-sm uppercase tracking-wide hover:bg-luxury-amber hover:text-luxury-midnight transition-all duration-300 hover:scale-105"
            style={{ letterSpacing: '0.12em' }}
          >
            Book Your Experience
          </a>
        </motion.div>
      </div>
    </section>
  )
}
