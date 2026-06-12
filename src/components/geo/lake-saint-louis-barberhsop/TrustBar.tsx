'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';


const TrustBar = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  const stats = [
    { value: '4.9★', label: 'Google Rating' },
    { value: '648+', label: 'Clients Served' },
    { value: '$45', label: 'Starting Price' },
    { value: '7 Days', label: 'Open Every Week' },
  ]

  return (
    <section
      ref={ref}
      className="bg-luxury-charcoal border-y border-luxury-graphite"
      aria-label="Trust statistics"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-luxury-graphite">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center justify-center py-5 px-4 text-center"
            >
              <span className="font-playfair text-2xl text-luxury-amber font-medium">
                {s.value}
              </span>
              <span
                className="font-mono text-luxury-pearl/40 text-xs uppercase mt-1"
                style={{ letterSpacing: '0.18em' }}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBar;