"use client";

import { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { openBooksyWidget } from "@/lib/utils";
import { CAREER_LOCATIONS } from "@/lib/careers";

const slides = [
  {
    id: 1,
    eyebrow: "Premium Grooming Experience",
    headline: "Where Modern Gentlemen\nRefine Their Image",
    description:
      "Luxury grooming crafted for professionals who value confidence, precision, and style.",
    cta: "Book Appointment",
    ctaHref: "#contact",
    image:
      // 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80'
      "/home/hero/slide-1.jpg",
    alt: "Expert barber at work in luxury grooming studio",
  },
  {
    id: 2,
    eyebrow: "The Art of Refinement",
    headline: "Precision.\nSophistication.\nConsistency.",
    description:
      "Every cut, every shave, every detail — executed to perfection by master craftsmen who understand your craft.",
    cta: "Explore Services",
    ctaHref: "#services",
    image:
      // 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1920&q=80'
      "/home/hero/slide-2.jpg",
    alt: "Close-up of precision grooming tools on marble surface",
  },
  {
    id: 3,
    eyebrow: "Beyond The Ordinary",
    headline: "More Than A Haircut.\nAn Experience.",
    description:
      "Step into a sanctuary where modern masculinity meets timeless refinement. Your appointment awaits.",
    cta: "Discover TGH",
    ctaHref: "#about",
    image:
      // 'https://images.unsplash.com/photo-1521588934564-00c3a5a0c7ac?w=1920&q=80'
      "/home/hero/slide-3.jpg",
    alt: "Luxury barbershop interior with warm lighting",
  },
];

const SLIDE_DURATION = 6000;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hiringLocation = CAREER_LOCATIONS.find(
    (location) => location.status === "Now Hiring",
  );

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "15%"]);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[620px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Featured content slider"
    >
      {/* Background Slides */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="hidden md:block absolute inset-0"
        >
          {/* Parallax wrapper */}
          <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
            <Image
              src={slides[current].image}
              alt={slides[current].alt}
              fill
              priority={current === 0}
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
          </motion.div>

          {/* Layered overlays for cinematic depth */}
          {/* <div className="absolute inset-0 bg-luxury-midnight/50" /> */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/80 via-luxury-midnight/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/80 via-transparent to-transparent" />
        </motion.div>

        <motion.div
          key={`mobile-${slides[current].id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className=" absolute inset-0 md:hidden"
        >
          {/* Parallax wrapper */}
          <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
            <Image
              src="/about/tgh-seats.jpeg"
              alt="Luxury barbershop interior with warm lighting"
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
              quality={90}
            />
          </motion.div>

          {/* Layered overlays for cinematic depth */}
          <div className="absolute inset-0 bg-luxury-midnight/50" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/80 via-luxury-midnight/30 to-transparent" /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/80 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide Content */}
      <div className="relative z-10 pt-12 md:pt-16 h-full flex items-center">
        <div className="max-w-luxury mx-auto px-6 lg:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slides[current].id}`}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-2xl"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="flex items-center gap-3 mb-6"
              >
                <div className="w-8 h-px bg-luxury-amber" />
                <span
                  className="font-mono text-luxury-amber text-xs uppercase"
                  style={{ letterSpacing: "0.25em" }}
                >
                  {slides[current].eyebrow}
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="font-playfair text-4xl md:text-6xl lg:text-7xl text-luxury-ivory leading-tight mb-6"
                style={{ whiteSpace: "pre-line" }}
              >
                {slides[current].headline}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="font-outfit text-luxury-pearl/70 text-base md:text-lg max-w-lg leading-relaxed mb-10"
              >
                {slides[current].description}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={
                    slides[current].cta === "Book Appointment"
                      ? openBooksyWidget
                      : () => handleNavClick(slides[current].ctaHref)
                  }
                  className="group inline-flex items-center gap-3 px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit font-medium text-sm uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 hover:scale-105"
                  style={{ letterSpacing: "0.12em" }}
                >
                  {slides[current].cta}
                  <ChevronRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                </button>
                <button
                  onClick={() => handleNavClick("#services")}
                  className="inline-flex items-center gap-2 px-8 py-4 border border-luxury-ivory/20 text-luxury-ivory/80 font-outfit text-sm uppercase tracking-wide hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300"
                  style={{ letterSpacing: "0.12em" }}
                >
                  View Services
                </button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:flex absolute z-20  inset-y-0 right-6 lg:right-12 flex-col items-center justify-center gap-3">
        <button
          onClick={prev}
          className="w-10 h-10 flex items-center justify-center border border-luxury-ivory/20 text-luxury-ivory/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={next}
          className="w-10 h-10 flex items-center justify-center border border-luxury-ivory/20 text-luxury-ivory/60 hover:border-luxury-amber hover:text-luxury-amber transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute z-20 bottom-5 left-6 lg:left-12 flex items-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-500 ${
              i === current
                ? "w-10 h-0.5 bg-luxury-amber"
                : "w-4 h-0.5 bg-luxury-ivory/30 hover:bg-luxury-ivory/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
          />
        ))}
        <span className="font-mono text-luxury-pearl/40 text-xs ml-2">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* Hiring Badge */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="absolute z-20 bottom-72 md:bottom-12 right-2 lg:right-64"
      >
        <a href="/careers" className="group block">
          <div className="bg-luxury-midnight/80 backdrop-blur-sm border border-luxury-amber/25 px-4 py-3 shadow-xl shadow-black/20 transition-all duration-300 group-hover:border-luxury-amber/50 group-hover:bg-luxury-midnight/90">
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-luxury-amber shadow-[0_0_0_4px_rgba(212,175,55,0.16)]" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: "0.22em" }}
              >
                Now Hiring
              </span>
            </div>
            <div className="font-playfair text-luxury-ivory text-sm md:text-base leading-tight">
              {hiringLocation?.name ?? "Lake Saint Louis"}
            </div>
          </div>
        </a>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="absolute z-20 bottom-1 md:bottom-12 right-2 lg:right-12"
      >
        <a
          href="https://g.page/r/CcacO9CgMp4ZEAE/review"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="bg-luxury-charcoal/80 backdrop-blur-sm border border-luxury-graphite px-5 py-3">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className="fill-luxury-amber text-luxury-amber"
                />
              ))}
            </div>
            <div className="font-playfair text-luxury-ivory text-sm">
              5 ★ Customer Rating
            </div>
            <div className="font-mono text-luxury-pearl/40 text-xs mt-0.5">
              648+ Verified Reviews
            </div>
          </div>
        </a>
      </motion.div>

      {/* Progress Bar */}
      <div className="absolute z-20 bottom-0 left-0 right-0 h-px bg-luxury-graphite">
        <motion.div
          key={current}
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, originX: 0 }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
          className="h-full bg-luxury-amber"
          style={{ transformOrigin: "left center" }}
        />
      </div>
    </section>
  );
}
