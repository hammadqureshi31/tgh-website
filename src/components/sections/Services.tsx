'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Scissors, Sparkles, User, Wand2, Layers, Crown, X } from 'lucide-react'
import { openBooksyWidget } from '@/lib/utils'

type Service = {
  id: number
  icon: any
  title: string
  description: string
  price: string
  duration: string
  details: string
  includes: string[]
}

const services: Service[] = [
  {
    id: 1,
    icon: Scissors,
    title: 'Classic Haircut',
    description:
      'Timeless precision cuts tailored to your face shape, lifestyle, and personal aesthetic.',
    price: '$65',
    duration: '45 mins',
    details: 'Experience a tailored grooming session designed to elevate your personal style. Our master barbers analyze your hair type and face shape to deliver a precision cut that looks impeccable from day one and grows out perfectly.',
    includes: [
      'Personalized consultation',
      'Invigorating scalp massage & wash',
      'Precision cut using scissors and clippers',
      'Hot lather neck shave',
      'Blow-dry and premium styling'
    ]
  },
  {
    id: 2,
    icon: Wand2,
    title: 'Modern Styling',
    description:
      'Contemporary looks executed with editorial precision using premium styling products.',
    price: '$45',
    duration: '30 mins',
    details: 'Whether preparing for a special event or refreshing your look, our styling service focuses on contemporary trends and classic elegance. We use only top-tier products to ensure your hair holds its shape while maintaining a natural finish.',
    includes: [
      'Style consultation',
      'Deep cleansing shampoo & condition',
      'Expert blow-drying technique',
      'Application of premium pomades or clays',
      'Finishing touches for lasting hold'
    ]
  },
  {
    id: 3,
    icon: User,
    title: 'Beard Sculpting',
    description:
      'Artisan beard design and maintenance — from clean lines to full sculpted statements.',
    price: '$40',
    duration: '30 mins',
    details: 'Your beard is a defining feature. Our sculpting service shapes and tames your facial hair to perfectly frame your jawline. We blend traditional techniques with modern tools to achieve symmetry and flawless lines.',
    includes: [
      'Facial structure analysis',
      'Precision trimming and shaping',
      'Crisp edge lineup with straight razor',
      'Application of nourishing beard oils',
      'Hot towel soothing treatment'
    ]
  },
  {
    id: 4,
    icon: Sparkles,
    title: 'Luxury Shave',
    description:
      'The ritual of a traditional hot-towel straight razor shave, elevated for the modern gentleman.',
    price: '$55',
    duration: '45 mins',
    details: 'Indulge in the ultimate relaxation with our luxury wet shave. This traditional multi-step ritual opens pores, softens the hair, and provides an impossibly close shave while protecting and rejuvenating your skin.',
    includes: [
      'Pre-shave essential oil massage',
      'Multiple hot eucalyptus towels',
      'Warm lather application',
      'Precision straight razor pass (with & across grain)',
      'Cold towel finish & soothing aftershave balm'
    ]
  },
  {
    id: 5,
    icon: Layers,
    title: 'Facial Grooming',
    description:
      'Restorative skincare treatments designed specifically for men who demand the best.',
    price: '$85',
    duration: '60 mins',
    details: 'Combat environmental stress and fatigue with our premium facial grooming. This comprehensive treatment deeply cleanses, exfoliates, and hydrates, leaving your skin clear, vibrant, and youthfully refreshed.',
    includes: [
      'Deep pore steam cleansing',
      'Exfoliating scrub to remove dead skin',
      'Detoxifying clay mask',
      'Hydrating serum application',
      'Relaxing face and neck massage'
    ]
  },
  {
    id: 6,
    icon: Crown,
    title: 'Executive Package',
    description:
      'Our signature experience — haircut, shave, facial, and styling. The complete gentleman.',
    price: '$180',
    duration: '120 mins',
    details: 'The pinnacle of our offerings. The Executive Package is a comprehensive grooming transformation. Retreat from the world and emerge completely revitalized, groomed to absolute perfection from head to collar.',
    includes: [
      'Classic Haircut & Modern Styling',
      'Luxury Hot Towel Shave',
      'Complete Facial Grooming treatment',
      'Complimentary premium beverage',
      'Exclusive product samples'
    ]
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
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedService])

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
                onClick={() => setSelectedService(service)}
                className="group bg-luxury-ivory p-8 lg:p-10 cursor-pointer hover:bg-luxury-graphite transition-colors duration-500 relative overflow-hidden"
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

      {/* Service Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-luxury-midnight/80 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-2xl bg-luxury-ivory shadow-2xl overflow-hidden border border-luxury-amber/30 z-10 flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-luxury-charcoal/50 hover:text-luxury-amber transition-colors z-10 bg-luxury-ivory/80 rounded-full"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="p-8 sm:p-10 overflow-y-auto">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 shrink-0 flex items-center justify-center border border-luxury-amber bg-[#F8F5F0]">
                    <selectedService.icon className="text-luxury-amber" size={28} />
                  </div>
                  <div>
                    <h3 className="font-playfair text-2xl sm:text-3xl text-luxury-charcoal mb-2">
                      {selectedService.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-luxury-amber text-xs uppercase tracking-widest bg-luxury-amber/10 px-3 py-1">
                        {selectedService.duration}
                      </span>
                      <span className="font-mono text-luxury-charcoal text-xs uppercase tracking-widest bg-luxury-graphite/10 px-3 py-1">
                        {selectedService.price}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-px bg-luxury-graphite/20 mb-8" />

                <p className="font-outfit text-luxury-charcoal/80 text-base leading-relaxed mb-8">
                  {selectedService.details}
                </p>

                <h4 className="font-playfair text-xl text-luxury-charcoal mb-5">
                  What's Included
                </h4>
                <ul className="space-y-4 mb-10">
                  {selectedService.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 bg-luxury-amber mt-2 shrink-0" />
                      <span className="font-outfit text-luxury-charcoal/80 text-base">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto pt-6 border-t border-luxury-graphite/20">
                  <button
                    onClick={() => {
                      setSelectedService(null)
                      // setTimeout(() => {
                      //   document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                      // }, 300)
                      openBooksyWidget()
                    }}
                    className="w-full bg-luxury-charcoal text-luxury-amber font-outfit text-sm uppercase tracking-widest py-4 hover:bg-luxury-amber hover:text-luxury-charcoal transition-colors border border-luxury-charcoal text-center"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
