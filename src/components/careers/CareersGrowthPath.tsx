'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Scissors, Award, Users, Briefcase, ArrowRight, DollarSign, ListChecks, Sparkles } from 'lucide-react'

interface GrowthLevel {
  level: number
  icon: typeof Scissors
  title: string
  requirements: string[]
  compensation: string
  compensationNote?: string
  benefits?: string[]
  nextOpportunity: string
}

const GROWTH_LEVELS: GrowthLevel[] = [
  {
    level: 1,
    icon: Scissors,
    title: 'TGH Barber',
    requirements: ['Valid state barber license', 'Complete TGH onboarding'],
    compensation: '$42,000–$62,000',
    benefits: ['Revenue share', 'Product commissions'],
    nextOpportunity: 'Senior Barber within 12 months',
  },
  {
    level: 2,
    icon: Award,
    title: 'TGH Senior Barber',
    requirements: ['12 months at TGH', 'Top-half KPI performance', 'Strong client retention'],
    compensation: '47% commission structure',
    benefits: ['Featured content opportunities', 'Brand ambassador opportunities'],
    nextOpportunity: 'Shop Manager consideration',
  },
  {
    level: 3,
    icon: Users,
    title: 'TGH Shop Manager',
    requirements: ['Internal promotion preferred', 'Leadership aptitude', 'Operational interest'],
    compensation: '$52,000–$72,000',
    compensationNote: 'Base salary',
    benefits: ['Bonuses', 'Benefits'],
    nextOpportunity: 'District Manager consideration',
  },
  {
    level: 4,
    icon: Briefcase,
    title: 'TGH District Manager',
    requirements: ['18+ months as successful Shop Manager', 'Proven leadership development'],
    compensation: '$72,000–$95,000',
    benefits: ['Performance bonuses up to $20K', 'Car allowance'],
    nextOpportunity: 'Market President or Franchise Partner',
  },
]

export default function CareersGrowthPath() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="growth-path" className="py-24 md:py-32 bg-luxury-midnight overflow-hidden">
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20 lg:mb-24"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span className="font-mono text-luxury-amber text-xs uppercase" style={{ letterSpacing: '0.25em' }}>
              The Path Forward
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-ivory mb-5" style={{ lineHeight: '1.2' }}>
            Your Career Journey at TGH
          </h2>
          <p className="font-outfit text-luxury-pearl/50 text-base max-w-xl mx-auto leading-relaxed">
            A structured pathway from Barber to leadership opportunities.
          </p>
        </motion.div>

        {/* Desktop: horizontal roadmap */}
        <div className="hidden lg:block relative">
          {/* Connecting progression line */}
          <div className="absolute top-[34px] left-0 right-0 h-px bg-luxury-graphite">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="h-px bg-gradient-to-r from-luxury-amber/20 via-luxury-amber to-luxury-amber/20 origin-left"
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            {GROWTH_LEVELS.map((lvl, idx) => (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: idx * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative"
              >
                {/* Milestone marker */}
                <div className="relative z-10 mb-8 flex justify-center">
                  <div className="w-[68px] h-[68px] rounded-full bg-luxury-midnight border-2 border-luxury-amber flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <lvl.icon size={26} className="text-luxury-amber" />
                  </div>
                </div>

                <GrowthCard level={lvl} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile / tablet: vertical timeline */}
        <div className="lg:hidden relative pl-10">
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-luxury-graphite">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3 }}
              className="w-px h-full bg-gradient-to-b from-luxury-amber/20 via-luxury-amber to-luxury-amber/20 origin-top"
            />
          </div>

          <div className="space-y-10">
            {GROWTH_LEVELS.map((lvl, idx) => (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-10 top-0 w-8 h-8 rounded-full bg-luxury-midnight border-2 border-luxury-amber flex items-center justify-center">
                  <lvl.icon size={14} className="text-luxury-amber" />
                </div>
                <GrowthCard level={lvl} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GrowthCard({ level }: { level: GrowthLevel }) {
  return (
    <div className="group bg-luxury-charcoal border border-luxury-graphite hover:border-luxury-amber/40 transition-all duration-300 p-6 flex flex-col h-5/6 hover:-translate-y-1">
      <span
        className="font-mono text-luxury-amber/50 text-xs uppercase mb-2 block"
        style={{ letterSpacing: '0.2em' }}
      >
        Level {level.level}
      </span>
      <h3 className="font-playfair text-xl text-luxury-ivory mb-5">{level.title}</h3>

      {/* Compensation */}
      <div className="mb-5 pb-5 border-b border-luxury-graphite/60">
        <div className="flex items-center gap-2 mb-1.5">
          <DollarSign size={13} className="text-luxury-amber/70" />
          <span className="font-mono text-luxury-pearl/35 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>
            Compensation
          </span>
        </div>
        <p className="font-playfair text-luxury-amber text-lg">{level.compensation}</p>
        {level.compensationNote && (
          <p className="font-outfit text-luxury-pearl/40 text-xs mt-0.5">{level.compensationNote}</p>
        )}
        {level.benefits && (
          <ul className="mt-2 space-y-1">
            {level.benefits.map((b) => (
              <li key={b} className="font-outfit text-luxury-pearl/50 text-xs flex items-start gap-1.5">
                <Sparkles size={10} className="text-luxury-amber/60 shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Requirements */}
      <div className="mb-5 flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <ListChecks size={13} className="text-luxury-amber/70" />
          <span className="font-mono text-luxury-pearl/35 text-xs uppercase" style={{ letterSpacing: '0.15em' }}>
            Requirements
          </span>
        </div>
        <ul className="space-y-1.5">
          {level.requirements.map((req) => (
            <li key={req} className="font-outfit text-luxury-pearl/60 text-xs leading-relaxed flex items-start gap-1.5">
              <span className="w-1 h-1 rounded-full bg-luxury-amber/60 shrink-0 mt-1.5" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Next opportunity */}
      <div className="pt-4 border-t border-luxury-graphite/60 flex items-start gap-2">
        <ArrowRight size={13} className="text-luxury-amber shrink-0 mt-0.5" />
        <p className="font-outfit text-luxury-pearl/45 text-xs leading-relaxed">{level.nextOpportunity}</p>
      </div>
    </div>
  )
}
