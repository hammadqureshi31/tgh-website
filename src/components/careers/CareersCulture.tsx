'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { Crown, ShieldCheck, Users2, HeartHandshake, TrendingUp } from 'lucide-react'

const PILLARS = [
  { icon: Crown, label: 'Excellence' },
  { icon: ShieldCheck, label: 'Professionalism' },
  { icon: Users2, label: 'Teamwork' },
  { icon: HeartHandshake, label: 'Community' },
  { icon: TrendingUp, label: 'Growth' },
]

export default function CareersCulture() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="py-24 md:py-32 bg-luxury-ivory overflow-hidden" style={{ backgroundColor: '#f8f5f0' }}>
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
              Culture
            </span>
            <div className="w-8 h-px bg-luxury-amber" />
          </div>
          <h2 className="font-playfair text-3xl md:text-5xl text-luxury-midnight" style={{ lineHeight: '1.2' }}>
            A Team Built On Craft
          </h2>
        </motion.div>

        {/* Magazine-style asymmetric grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 relative aspect-[16/10] overflow-hidden group"
          >
            <Image
              src="/blog post/post-1.jpg"
              alt="TGH team collaborating in the shop"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 66vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="font-mono text-luxury-amber text-xs uppercase mb-2" style={{ letterSpacing: '0.2em' }}>
                The Shop Floor
              </p>
              <p className="font-playfair text-luxury-ivory text-2xl italic max-w-md">
                Where craft meets camaraderie, every single day.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative aspect-[16/10] lg:aspect-auto overflow-hidden group"
          >
            <Image
              src="/about/tgh-seats.jpeg"
              alt="Luxury barbershop interior at The Gentry House"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-luxury-midnight/20" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="relative aspect-[16/10] overflow-hidden group"
          >
            <Image
              src="/blog post/post-3.jpg"
              alt="A client consultation at The Gentry House"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 33vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-luxury-midnight/20" />
          </motion.div>
          

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="lg:col-span-2 relative aspect-[16/10] overflow-hidden group"
          >
            <Image
              src="/about/grand-opening.jpeg"
              alt="The Gentry House team and community"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 66vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="font-mono text-luxury-amber text-xs uppercase mb-2" style={{ letterSpacing: '0.2em' }}>
                The Community
              </p>
              <p className="font-playfair text-luxury-ivory text-2xl italic max-w-md">
                Clients who become regulars. Regulars who become family.
              </p>
            </div>
          </motion.div>
          
        </div>

        {/* Content pillars */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-14 pt-12 border-t border-luxury-graphite/20"
        >
          {PILLARS.map((pillar) => (
            <div key={pillar.label} className="flex items-center gap-3">
              <pillar.icon size={18} className="text-luxury-amber" />
              <span
                className="font-mono text-luxury-graphite/70 text-xs uppercase"
                style={{ letterSpacing: '0.18em' }}
              >
                {pillar.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
