'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Sparkles, Users, CalendarClock, TrendingUp, DollarSign, GraduationCap } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Premium Environment',
    description: 'Work in a thoughtfully designed shop built around craft, comfort, and consistency.',
  },
  {
    icon: Users,
    title: 'High-End Clientele',
    description: 'Serve professional, repeat clients who value quality and respect your expertise.',
  },
  {
    icon: CalendarClock,
    title: 'Flexible Scheduling',
    description: 'Schedules built around your life, with shift options that support a sustainable career.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    description: 'A clear path from Junior Barber to Senior Barber to Shop Manager.',
  },
  {
    icon: DollarSign,
    title: 'Performance-Based Earnings',
    description: 'Competitive base pay plus commission, tips, and performance incentives that scale with your craft.',
  },
  {
    icon: GraduationCap,
    title: 'Professional Development',
    description: 'Ongoing technique training and mentorship from senior stylists.',
  },
]

export default function CareersWhyTGH() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 md:py-32 bg-luxury-ivory" style={{ backgroundColor: '#f8f5f0' }}>
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-midnight mb-6" style={{ lineHeight: '1.2' }}>
            Why Work At TGH
          </h2>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px bg-luxury-amber/30" style={{ width: '80px' }} />
            <div className="w-2 h-2 rotate-45 bg-luxury-amber" />
            <div className="h-px bg-luxury-amber/30" style={{ width: '80px' }} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group bg-white p-8 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-black/5 hover:border-luxury-amber/30 flex flex-col h-full"
            >
              <div className="w-12 h-12 border border-luxury-amber/30 flex items-center justify-center mb-6 group-hover:bg-luxury-amber group-hover:border-luxury-amber transition-all duration-300">
                <feature.icon size={20} className="text-luxury-amber group-hover:text-luxury-midnight transition-colors duration-300" />
              </div>
              <h3 className="font-playfair text-xl text-luxury-midnight mb-3">{feature.title}</h3>
              <p className="font-outfit text-luxury-graphite/70 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
