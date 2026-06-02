"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { openBooksyWidget } from "@/lib/utils";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="book" className="overflow-hidden" ref={ref}>
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        {/* Left: Luxury Image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative min-h-[400px] lg:min-h-[600px] order-2 lg:order-1"
        >
          <Image
            // src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=900&q=80"
            src="/home/book-bg.jpg"
            alt="Premium barbershop chair and grooming station"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-luxury-midnight/30" />

          {/* Floating label */}
          <div className="absolute bottom-8 left-8">
            <div className="bg-luxury-midnight/80 backdrop-blur-sm border-l-2 border-luxury-amber px-5 py-4">
              <div
                className="font-mono text-luxury-amber text-xs uppercase mb-1"
                style={{ letterSpacing: "0.2em" }}
              >
                Open Daily
              </div>
              <div className="font-playfair text-luxury-ivory text-sm">
                Mon–Thu: 9am – 8pm
                <br />
                Fri–Sat: 9am – 9pm
                <br />
                Sun: 9am – 7pm
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: CTA Content */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{
            duration: 0.9,
            delay: 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="bg-luxury-charcoal flex items-center order-1 lg:order-2"
        >
          <div className="px-8 lg:px-16 py-16 lg:py-20 w-full">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: "0.25em" }}
              >
                Book With Us
              </span>
            </div>

            {/* Headline */}
            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory mb-6"
              style={{ lineHeight: "1.15" }}
            >
              Ready For Your Next
              <span className="italic text-luxury-amber"> Appointment?</span>
            </h2>

            {/* Description */}
            <p className="font-outfit text-luxury-pearl/60 text-base leading-relaxed mb-10 max-w-md">
              Your next chapter begins with a single booking. Secure your
              preferred time slot and step into an experience crafted
              exclusively for the modern gentleman.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={openBooksyWidget}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                style={{ letterSpacing: "0.12em" }}
              >
                Book Now
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </button>
              <a
                href="tel:+16363692742"
                className="group flex items-center justify-center gap-3 px-8 py-4 border border-luxury-ivory/20 text-luxury-ivory/80 font-outfit text-sm uppercase tracking-wide hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                <Phone size={14} />
                Call Us
              </a>
            </div>

            {/* Address */}
            <div className="pt-10 border-t border-luxury-graphite">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <div
                    className="font-mono text-luxury-amber/50 text-xs uppercase mb-2"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    Location
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=11112+Veterans+Memorial+Pkwy,+Lake+Saint+Louis,+MO+63367"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-outfit text-luxury-pearl/50 text-sm leading-relaxed hover:text-luxury-amber transition-colors duration-300"
                  >
                    11112 Veterans Memorial Pkwy,
                    <br />
                    Lake Saint Louis, 63367
                  </a>
                </div>
                <div>
                  <div
                    className="font-mono text-luxury-amber/50 text-xs uppercase mb-2"
                    style={{ letterSpacing: "0.2em" }}
                  >
                    Contact
                  </div>
                  <p className="font-outfit text-luxury-pearl/60 text-sm leading-relaxed">
                    +1 (636) 369-2742
                    <br />
                    thegentryhousebarbershop@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
