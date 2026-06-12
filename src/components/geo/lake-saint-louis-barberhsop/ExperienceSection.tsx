'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { Calendar, ChevronRight } from 'lucide-react'
import { openBooksyWidget } from '@/lib/utils'

const ExperienceSection = () =>  {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="relative py-32 md:py-40 overflow-hidden"
      aria-label="The Gentry House experience"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/home/testimonial.jpg"
          alt="Luxury barbershop atmosphere"
          fill
          className="object-cover"
          sizes="100vw"
          quality={80}
        />
        <div className="absolute inset-0 bg-luxury-midnight/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-midnight/30 via-transparent to-luxury-midnight/30" />
      </div>

      <div className="relative z-10 max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <div className="w-8 h-px bg-luxury-amber/50" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: '0.25em' }}
            >
              The Experience
            </span>
            <div className="w-8 h-px bg-luxury-amber/50" />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-playfair text-3xl md:text-5xl text-luxury-ivory mb-8"
            style={{ lineHeight: '1.2' }}
          >
            More Than a Haircut.
            <br />
            <span className="italic text-luxury-amber">A Well-Spent Hour.</span>
          </motion.h2>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="space-y-5"
          >
            <p className="font-outfit text-luxury-pearl/70 text-base md:text-lg leading-relaxed">
              You walk in. The space is clean, the lighting is right, and
              nobody is in a hurry. Your barber already knows what you need —
              or asks the right question if it is your first time.
            </p>
            <p className="font-outfit text-luxury-pearl/70 text-base md:text-lg leading-relaxed">
              The cut begins. There is no flinching at detail. The fade is
              worked slowly until it is invisible. The line is drawn with
              intention. The finish is checked twice from two angles before
              you see it.
            </p>
            <p className="font-outfit text-luxury-pearl/70 text-base md:text-lg leading-relaxed">
              You leave looking exactly like someone who knows what he is doing
              — because you went somewhere that does.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12"
          >
            <button
              onClick={openBooksyWidget}
              className="group inline-flex items-center gap-3 px-10 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
              style={{ letterSpacing: '0.12em' }}
            >
              <Calendar size={15} />
              Reserve Your Appointment
              <ChevronRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
};

export default ExperienceSection;