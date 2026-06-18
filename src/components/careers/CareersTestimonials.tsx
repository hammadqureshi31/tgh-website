'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Quote, TrendingUp } from 'lucide-react'

// Placeholder career-story content — structured so real employee testimonials
// can be dropped in later by replacing this array only (no layout changes needed).
export interface CareerStory {
  quote: string
  name: string
  role: string
  highlight?: string
}

const CAREER_STORIES: CareerStory[] = [
  {
    quote:
      "I came in as a Junior Barber with two years of experience. Eighteen months later I'm running my own chair as a Senior Barber with a real client book.",
    name: 'Team Member',
    role: 'Senior Barber, Lake Saint Louis',
    highlight: 'Promoted within 18 months',
  },
  {
    quote:
      'The mentorship here is the real deal — senior stylists actually want to see you improve, not just hit numbers.',
    name: 'Team Member',
    role: 'TGH Barber, Lake Saint Louis',
  },
  {
    quote:
      "Managing the shop floor taught me more about leadership in a year than anywhere else I've worked. TGH invests in people who want to grow.",
    name: 'Team Member',
    role: 'Shop Manager',
    highlight: 'Promoted from Barber to Manager',
  },
]

export default function CareersTestimonials() {
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
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span className="font-mono text-luxury-amber text-xs uppercase" style={{ letterSpacing: '0.25em' }}>
              From Our Team
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-midnight" style={{ lineHeight: '1.2' }}>
            Real Careers, Real Growth
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {CAREER_STORIES.map((story, idx) => (
            <motion.div
              key={story.quote}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white p-8 border border-black/5 flex flex-col h-full"
            >
              <Quote size={24} className="text-luxury-amber/40 mb-5" />
              <p className="font-outfit text-luxury-graphite/80 text-sm leading-relaxed mb-6 flex-grow">
                "{story.quote}"
              </p>
              {story.highlight && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 bg-luxury-amber/10 border border-luxury-amber/20 self-start">
                  <TrendingUp size={12} className="text-luxury-amber" />
                  <span className="font-mono text-luxury-amber text-xs uppercase" style={{ letterSpacing: '0.1em' }}>
                    {story.highlight}
                  </span>
                </div>
              )}
              <div className="pt-5 border-t border-black/5">
                <p className="font-playfair text-luxury-midnight text-base">{story.name}</p>
                <p className="font-outfit text-luxury-graphite/50 text-xs mt-0.5">{story.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
