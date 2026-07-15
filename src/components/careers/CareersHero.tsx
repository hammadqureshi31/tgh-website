"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CareersHero() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-luxury-midnight">
      <div className="max-w-luxury z-20 mx-auto px-6 lg:px-12 w-full" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          {/* Left — headline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85 }}
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: "0.25em" }}
              >
                Careers
              </span>
            </div>

            <h1
              className="font-playfair text-5xl md:text-6xl lg:text-7xl text-luxury-ivory mb-7"
              style={{ lineHeight: "1.04" }}
            >
              Join The Gentry
              <br />
              <span className="italic text-luxury-amber">House Team</span>
            </h1>

            <p className="font-playfair italic text-luxury-amber/90 text-xl md:text-2xl mb-5">
              Build a career — not just a chair.
            </p>

            <p className="font-outfit text-luxury-pearl/50 text-base md:text-lg leading-relaxed mb-12 max-w-lg">
              Join a team focused on craftsmanship, growth, leadership, and
              creating exceptional client experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#apply"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("apply")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                style={{ letterSpacing: "0.12em" }}
              >
                Apply Now
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </a>
              <a
                href="#growth-path"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("growth-path")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-luxury-ivory/14 text-luxury-ivory/65 font-outfit text-sm uppercase hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                style={{ letterSpacing: "0.12em" }}
              >
                Explore Career Paths
              </a>
            </div>
          </motion.div>

          {/* Right — premium imagery */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="relative"
          >
            <div className="absolute -top-4 -right-4 w-full h-full border border-luxury-amber/20 z-0 hidden lg:block" />
            <div className="relative z-10 aspect-[4/5] overflow-hidden">
              <Image
                src="/about/about-1.jpg"
                alt="A TGH barber at work in the shop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/50 via-transparent to-transparent" />
              {/* Overlay */}
              <div className="absolute inset-0 bg-luxury-midnight/70" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-luxury-midnight px-6 py-5 border-l-2 border-luxury-amber hidden sm:block">
              <div
                className="font-mono text-luxury-amber text-xs uppercase mb-1"
                style={{ letterSpacing: "0.2em" }}
              >
                Now Hiring
              </div>
              <div className="font-playfair text-luxury-ivory text-lg italic">
                Manchester / Ballwin
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{
            duration: 1.2,
            delay: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-luxury-amber/30 to-transparent origin-left"
        />
      </div>
    </section>
  );
}
