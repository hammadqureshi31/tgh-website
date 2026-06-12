'use client'

import { openBooksyWidget } from "@/lib/utils"
import { useInView } from "framer-motion"
import { Check, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useRef } from "react"
import { motion } from 'framer-motion';


const differentiators = [
  {
    label: 'Consistency',
    body: "Your barber knows your hair. Every visit builds on the last — we track your preferred length, fade grade, and product finish so the second cut is sharper than the first.",
  },
  {
    label: 'Attention to Detail',
    body: 'We do not rush. Every neckline, every edge, every transition is reviewed twice before you leave the chair. The result should be something you notice every time you pass a mirror.',
  },
  {
    label: 'Affordable Luxury',
    body: 'Premium grooming should not require a premium-hotel budget. Our pricing reflects what the work is worth — not what the market allows us to charge.',
  },
  {
    label: 'The Right Environment',
    body: 'Clean. Quiet. Intentional. No barber shop clutter, no TVs shouting at the walls. Just focus on the craft and a conversation worth having.',
  },
  {
    label: 'Product Integrity',
    body: 'We use what actually works — not what the rep pushed this quarter. Every product in our chair has been tested by the person using it on your hair.',
  },
]

const WhyTGHSection = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="py-24 md:py-32 bg-luxury-midnight overflow-hidden"
      aria-label="Why choose The Gentry House"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start"
          ref={ref}
        >
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -top-4 -left-4 w-full h-full border border-luxury-graphite z-0" />
            <div className="relative z-10 aspect-[4/5] overflow-hidden">
              <Image
                src="/about/about-us-cm.jpg"
                alt="The Gentry House barber at work — Lake Saint Louis"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/30 to-transparent" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-6 -right-6 z-20 bg-luxury-amber px-6 py-5">
              <div className="font-mono text-luxury-midnight text-xs uppercase mb-1" style={{ letterSpacing: '0.2em' }}>
                Since 2025
              </div>
              <div className="font-playfair text-luxury-midnight text-lg font-bold">
                Lake Saint Louis
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: '0.25em' }}
              >
                Why TGH
              </span>
            </div>

            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory mb-10"
              style={{ lineHeight: '1.15' }}
            >
              A Different
              <span className="italic text-luxury-amber"> Standard.</span>
            </h2>

            <div className="space-y-8">
              {differentiators.map((d, i) => (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-5 h-5 border border-luxury-amber/40 flex items-center justify-center">
                      <Check size={11} className="text-luxury-amber" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-luxury-ivory text-sm uppercase tracking-wide mb-2"
                      style={{ letterSpacing: '0.1em' }}>
                      {d.label}
                    </h3>
                    <p className="font-outfit text-luxury-pearl/50 text-sm leading-relaxed">
                      {d.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-10"
            >
              <button
                onClick={openBooksyWidget}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                style={{ letterSpacing: '0.12em' }}
              >
                Book Your First Visit
                <ChevronRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default WhyTGHSection;