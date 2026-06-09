'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Scissors, Sparkles, User, Wand2, Layers, Crown, X, Droplet } from 'lucide-react'
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
    title: 'Haircut',
    description: 'Hair wash & Hot Towel Style with product',
    price: '$40',
    duration: '30 mins',
    details: 'A premium haircut experience that includes a refreshing hair wash and a hot towel style with high-quality products.',
    includes: ['Hair wash', 'Hot towel', 'Styling with product']
  },
  {
    id: 2,
    icon: Scissors,
    title: 'Haircut & Beard',
    description: 'Hair wash & hot towel',
    price: '$60',
    duration: '45 mins',
    details: 'The perfect combo for a fresh look. Includes a precision haircut and detailed beard grooming, complete with a hair wash and hot towel.',
    includes: ['Haircut', 'Beard trim', 'Hair wash', 'Hot towel']
  },
  {
    id: 3,
    icon: User,
    title: "Kid's Haircut (Under 12)",
    description: 'Wash, hot towel, style',
    price: '$30',
    duration: '30 mins',
    details: 'A patient and fun haircut experience for young gentlemen, including a wash, hot towel, and styling.',
    includes: ['Precision cut', 'Hair wash', 'Hot towel', 'Styling']
  },
  {
    id: 4,
    icon: Crown,
    title: 'Full Service',
    description: 'Hair cut, beard trim, line up, straight razor, hair wash & styling',
    price: '$70',
    duration: '1 hour',
    details: 'We will make sure you get the Service you deserve and you would love. Includes haircut, beard trim and line up, straight razor finish, hair wash, and styling.',
    includes: ['Haircut', 'Beard trim & line up', 'Straight razor finish', 'Hair wash', 'Premium styling']
  },
  {
    id: 5,
    icon: Sparkles,
    title: 'Head Shave',
    description: 'Hot towel, lather, straight razor',
    price: '$50',
    duration: '30 mins',
    details: 'A smooth and refreshing head shave using a traditional straight razor, hot towel, and rich lather.',
    includes: ['Hot towel', 'Warm lather', 'Straight razor shave']
  },
  {
    id: 6,
    icon: Wand2,
    title: 'Skin Fade',
    description: 'Precision skin fade',
    price: '$45',
    duration: '30 mins',
    details: 'A modern skin fade with seamless blending for a sharp, clean look.',
    includes: ['Skin fade', 'Precision blending', 'Clean finish']
  },
  {
    id: 7,
    icon: Layers,
    title: 'Face Shave',
    description: 'Hot towel, straight razor, hot lather, cold towel.',
    price: '$35',
    duration: '30 mins',
    details: 'Smooth and slick up your face with our classic face shave. Includes hot towel, straight razor pass, hot lather, and a soothing cold towel.',
    includes: ['Hot towel', 'Hot lather', 'Straight razor shave', 'Cold towel finish']
  },
  {
    id: 8,
    icon: Scissors,
    title: 'Beard Trim & Line Up',
    description: 'Hot towel, straight razor',
    price: '$20',
    duration: '15 mins',
    details: 'Keep your beard looking sharp with a precise trim and crisp line up, finished with a hot towel and straight razor.',
    includes: ['Beard trim', 'Line up', 'Hot towel', 'Straight razor finish']
  },
  {
    id: 9,
    icon: Wand2,
    title: 'Eyebrow Shaping',
    description: 'Straight razor shaping',
    price: '$10',
    duration: '10 mins',
    details: 'Precise eyebrow shaping using a straight razor for a clean and defined look.',
    includes: ['Eyebrow assessment', 'Straight razor shaping']
  },
  {
    id: 10,
    icon: Sparkles,
    title: 'Ear Wax',
    description: 'Quick and clean ear waxing',
    price: '$8',
    duration: '10 mins',
    details: 'Safely and gently remove unwanted ear hair with our professional ear waxing service.',
    includes: ['Professional ear waxing', 'Quick and clean removal']
  },
  {
    id: 11,
    icon: Sparkles,
    title: 'Nose Wax',
    description: 'Quick and clean nose waxing',
    price: '$8',
    duration: '10 mins',
    details: 'Breathe easier and look cleaner with our quick and effective nose waxing service.',
    includes: ['Professional nose waxing', 'Quick and effective removal']
  },
  {
    id: 12,
    icon: Wand2,
    title: 'Eyebrow',
    description: 'Eyebrow clean up',
    price: '$8',
    duration: '10 mins',
    details: 'A quick clean up to keep your eyebrows looking neat and tidy.',
    includes: ['Eyebrow clean up']
  },
  {
    id: 13,
    icon: User,
    title: 'Beard Color',
    description: 'Black only',
    price: '$15',
    duration: '20 mins',
    details: 'Enhance your beard with our professional coloring service (black only) for a fuller, more defined look.',
    includes: ['Beard color application (Black)', 'Wash and condition']
  },
  {
    id: 14,
    icon: User,
    title: 'Hair Color',
    description: 'Black only',
    price: '$25',
    duration: '30 mins',
    details: 'Revitalize your look with our professional hair coloring service (black only).',
    includes: ['Hair color application (Black)', 'Wash and condition']
  },
  {
    id: 15,
    icon: Droplet,
    title: 'Hair Wash',
    description: 'Shampoo and conditioner on us no worries',
    price: '$0.01',
    duration: '5 mins',
    details: 'Enjoy a refreshing hair wash. FREE for all services. Shampoo and conditioner on us, no worries.',
    includes: ['Shampoo', 'Conditioner', 'Scalp massage']
  }
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
