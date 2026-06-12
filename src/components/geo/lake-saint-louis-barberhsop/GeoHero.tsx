"use client";

import Image from "next/image";
import { motion } from 'framer-motion';
import { MapPin, Calendar, ChevronRight, Star } from "lucide-react";
import { openBooksyWidget } from "@/lib/utils";


const GeoHero = () => {
  return (
    <section
      id="geo-hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="The Gentry House Lake Saint Louis — premier barbershop"
    >
      {/* Background */}
      <div className="hidden sm:block sm:absolute inset-0">
        <Image
          src="/home/hero/slide-1.jpg"
          alt="The Gentry House barbershop interior"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/90 via-luxury-midnight/60 to-luxury-midnight/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-luxury mx-auto px-6 lg:px-12 pt-28 pb-20 w-full">
        <div className="max-w-3xl">
          {/* Location eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-3 mb-8"
          >
            <MapPin size={12} className="text-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.3em" }}
            >
              Lake Saint Louis, Missouri
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl text-luxury-ivory leading-none mb-8"
          >
            Where Lake St. Louis
            <br />
            <span className="italic text-luxury-amber">Gentlemen</span>
            <br />
            Come for Their Edge.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-outfit text-luxury-pearl/70 text-lg max-w-lg leading-relaxed mb-12"
          >
            Premium cuts, precision fades, and luxury hot-towel shaves — at
            11112 Veterans Memorial Pkwy. No gimmicks. No rush. Just work that
            speaks.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={openBooksyWidget}
              className="group inline-flex items-center justify-center gap-3 px-10 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-semibold text-sm uppercase hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
              style={{ letterSpacing: "0.12em" }}
            >
              <Calendar size={15} />
              Book Your Appointment
              <ChevronRight
                size={15}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
            <a
              href="#transformations"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("transformations")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 border border-luxury-ivory/20 text-luxury-ivory/80 font-outfit text-sm uppercase tracking-wide hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
              style={{ letterSpacing: "0.12em" }}
            >
              View Our Work
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-8 right-6 lg:right-12 z-10"
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={9}
                className="fill-luxury-amber text-luxury-amber"
              />
            ))}
          </div>
          <span
            className="font-mono text-luxury-pearl/40 text-xs"
            style={{ letterSpacing: "0.15em" }}
          >
            4.9 · 648+ VERIFIED REVIEWS
          </span>
        </div>
      </motion.div>
    </section>
  );
};

export default GeoHero;
