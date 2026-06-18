'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MapPin, ExternalLink, ArrowRight } from 'lucide-react'
import { CAREER_LOCATIONS, CAREER_POSITIONS } from '@/lib/careers'

export default function CareersLocations() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 md:py-32 bg-luxury-midnight">
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
              Where You'll Work
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-ivory" style={{ lineHeight: '1.2' }}>
            Our Locations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CAREER_LOCATIONS.map((location, idx) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="group bg-luxury-charcoal border border-luxury-graphite hover:border-luxury-amber/30 transition-all duration-300 overflow-hidden"
            >
              {/* Map preview */}
              <div className="relative h-48 overflow-hidden border-b border-luxury-graphite">
                <iframe
                  title={`Map preview for ${location.name}`}
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${location.address}, ${location.city}, ${location.region} ${location.postalCode}`,
                  )}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.3) contrast(1.05)' }}
                  loading="lazy"
                  className="opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-luxury-charcoal/40 to-transparent" />
                <span
                  className={`absolute top-4 right-4 inline-flex items-center gap-2 px-4 py-1.5 font-mono text-xs uppercase ${
                    location.status === 'Now Hiring'
                      ? 'bg-green-950/80 text-green-300 border border-green-800/50'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                  }`}
                  style={{ letterSpacing: '0.15em' }}
                >
                  {location.status}
                </span>
              </div>

              <div className="p-7 lg:p-8">
                <div className="w-10 h-10 border border-luxury-amber/30 flex items-center justify-center mb-5">
                  <MapPin size={18} className="text-luxury-amber" />
                </div>
                <h3 className="font-playfair text-2xl text-luxury-ivory mb-2">{location.name}</h3>
                <p className="font-outfit text-luxury-pearl/50 text-sm leading-relaxed mb-5">
                  {location.address}
                  <br />
                  {location.city}, {location.region} {location.postalCode}
                </p>

                {/* Role tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {CAREER_POSITIONS.map((position) => (
                    <span
                      key={position}
                      className="px-3 py-1.5 bg-luxury-graphite/60 border border-luxury-graphite text-luxury-pearl/60 font-outfit text-xs"
                    >
                      {position}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-5">
                  <a
                    href="#open-positions"
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 bg-luxury-amber text-luxury-midnight font-outfit text-xs uppercase hover:bg-luxury-whiskey transition-all duration-300"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    View Positions
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 font-outfit text-sm text-luxury-pearl/50 hover:text-luxury-amber transition-colors duration-300"
                  >
                    Get Directions
                    <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
