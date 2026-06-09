'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { openBooksyWidget } from '@/lib/utils'

 interface PriceItem {
  name: string
  price: string
  description?: string
}

interface PriceCategory {
  label: string
  items: PriceItem[]
}

const pricingData: PriceCategory[] = [
  {
    label: 'Popular Services',
    items: [
      { name: "Haircut", price: "$40", description: "Hair wash & Hot Towel Style with product - 30min" },
      { name: "Haircut & beard", price: "$60", description: "Hair wash & hot towel - 45min" },
      { name: "Kid's Haircut (Under 12)", price: "$30", description: "Wash, hot towel, style - 30min" },
      { name: "Full service", price: "$70", description: "Hair cut, beard trim, line up, straight razor, wash & style - 1 hour" },
      { name: "Skin Fade", price: "$45", description: "30min" },
    ],
  },
  {
    label: 'Shave & Beard',
    items: [
      { name: "Head shave", price: "$50", description: "Hot towel lather straight razor - 30min" },
      { name: "Face Shave", price: "$35", description: "Hot towel, straight razor, hot leather, cold towel - 30min" },
      { name: "Beard trim and line up", price: "$20", description: "Hot towel, straight razor - 15min" },
      { name: "Beard color (Black)", price: "$15", description: "Black only - 20min" },
      { name: "Hair color (Black)", price: "$25", description: "Black only - 30min" },
    ],
  },
  {
    label: 'Grooming Extras',
    items: [
      { name: "Eyebrow Shaping", price: "$10", description: "Straight razor - 10min" },
      { name: "Ear wax", price: "$8", description: "10min" },
      { name: "Nose wax", price: "$8", description: "10min" },
      { name: "Eyebrow", price: "$8", description: "10min" },
      { name: "Hair wash", price: "$0.01", description: "FREE for all services (Shampoo & conditioner) - 5min" },
    ],
  },
]

function PriceCard({
  category,
  delay,
}: {
  category: PriceCategory
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      {/* Category Badge */}
      <div className="inline-flex items-center px-4 py-1.5 mb-8 bg-luxury-whiskey/15 border border-luxury-whiskey/30">
        <span
          className="font-mono text-luxury-amber text-xs uppercase"
          style={{ letterSpacing: '0.2em' }}
        >
          {category.label}
        </span>
      </div>

      {/* Price Items */}
      <div className="space-y-5">
        {category.items.map((item) => (
          <div key={item.name} className="items-end gap-0">
          <div className="flex items-end gap-0">
            <span className="font-outfit text-luxury-graphite/80 text-lg font-medium whitespace-nowrap">
              {item.name}
            </span>
            {/* Dotted line */}
            {/* <span
              className="flex-1 mx-3 mb-1"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(201,169,98,0.35) 1px, transparent 1px)',
                backgroundSize: '6px 1px',
                backgroundRepeat: 'repeat-x',
                backgroundPosition: 'bottom 2px left',
                height: '1px',
              }}
            /> */}
            <span className="flex-1 border-b border-dotted border-luxury-graphite/30 mx-4 mb-1" />
            <span className="font-playfair text-luxury-amber text-2xl font-medium whitespace-nowrap">
              {item.price}
            </span>
          </div>
          <p className="text-luxury-amber font-outfit text-sm mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" className="py-24 md:py-32 overflow-hidden" style={{ backgroundColor: '#f8f5f0' }}>
      <div className="max-w-luxury mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          {/* Promo Banner */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-luxury-amber/15 border border-luxury-amber/30 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: '0.2em' }}
            >
              Save 20% On Beauty Spa
            </span>
          </div>

          {/* Heading */}
          <h2
            className="font-playfair text-3xl md:text-5xl text-luxury-midnight mb-6"
            style={{ lineHeight: '1.2' }}
          >
            Our Barber Pricing
          </h2>

          {/* Luxury Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px bg-luxury-amber/30" style={{ width: '80px' }} />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rotate-45 bg-luxury-amber/60" />
              <div className="w-2 h-2 rotate-45 bg-luxury-amber" />
              <div className="w-1 h-1 rotate-45 bg-luxury-amber/60" />
            </div>
            <div className="h-px bg-luxury-amber/30" style={{ width: '80px' }} />
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pricingData.map((category, i) => (
            <PriceCard key={category.label} category={category} delay={i * 0.15} />
          ))}
        </div>

        {/* Dividers between columns — visible on desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden md:block"
        />

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-center mt-16 pt-10 border-t border-luxury-pearl"
        >
          {/* <p className="font-outfit text-luxury-graphite/50 text-sm mb-6">
            Prices may vary based on hair length and complexity. Consultations are always complimentary.
          </p> */}
          <button
            onClick={openBooksyWidget}
            className="inline-flex items-center gap-3 px-10 py-4 bg-luxury-midnight text-luxury-ivory font-outfit text-sm uppercase tracking-wide hover:bg-luxury-graphite transition-all duration-300 hover:scale-105"
            style={{ letterSpacing: '0.12em' }}
          >
            Book Appointment
          </button>
        </motion.div>
      </div>
    </section>
  )
}
