'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CAREER_LOCATIONS, OPEN_ROLES, getLocationById } from '@/lib/careers'

export const CAREERS_PREFILL_KEY = 'tgh-career-prefill'

function applyTo(position: string, location: string) {
  try {
    sessionStorage.setItem(CAREERS_PREFILL_KEY, JSON.stringify({ position, location }))
  } catch {
    // sessionStorage unavailable (e.g. private browsing) — form just opens blank
  }
  document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' })
}

export default function CareersPositions() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="open-positions" className="py-24 md:py-32 bg-luxury-midnight">
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
              Open Positions
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-ivory" style={{ lineHeight: '1.2' }}>
            Find Your Role
          </h2>
        </motion.div>

        <div className="space-y-16">
          {CAREER_LOCATIONS.map((location, locIdx) => {
            const roles = OPEN_ROLES.filter((role) => role.locationId === location.id)
            return (
              <div key={location.id}>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 pb-4 border-b border-luxury-graphite">
                  <div>
                    <h3 className="font-playfair text-2xl text-luxury-ivory">
                      {location.name}{' '}
                      <span className="font-outfit text-sm text-luxury-pearl/40">
                        ({location.status === 'Now Hiring' ? 'Current Shop' : 'Coming Soon'})
                      </span>
                    </h3>
                    <p className="font-outfit text-luxury-pearl/40 text-sm mt-1">
                      {location.address}, {location.city}, {location.region}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 self-start font-mono text-xs uppercase ${
                      location.status === 'Now Hiring'
                        ? 'bg-green-950/40 text-green-300 border border-green-800/40'
                        : 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                    }`}
                    style={{ letterSpacing: '0.15em' }}
                  >
                    {location.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {roles.map((role, idx) => (
                    <motion.div
                      key={`${location.id}-${role.title}`}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, delay: (locIdx * 3 + idx) * 0.06 }}
                      className="group bg-luxury-charcoal p-7 border border-luxury-graphite hover:border-luxury-amber/30 transition-all duration-300 flex flex-col"
                    >
                      <span className="font-mono text-luxury-amber text-xs uppercase mb-3" style={{ letterSpacing: '0.15em' }}>
                        {location.name}
                      </span>
                      <h4 className="font-playfair text-xl text-luxury-ivory mb-4">{role.title}</h4>
                      <span
                        className={`inline-flex items-center gap-1.5 mb-6 font-outfit text-xs ${
                          location.status === 'Now Hiring' ? 'text-green-400' : 'text-amber-400'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {location.status}
                      </span>
                      <button
                        onClick={() => applyTo(role.title, location.name)}
                        className="group mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-luxury-amber text-luxury-midnight font-outfit text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300"
                        style={{ letterSpacing: '0.1em' }}
                      >
                        Apply
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
