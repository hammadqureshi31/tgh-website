"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { openBooksyWidget } from "@/lib/utils";

const transformations = [
  {
    src: "/gallery/img-7.png",
    alt: "Precision fade haircut",
    style: "The Precision Fade",
    note: "Clean taper, seamless blend",
    span: "col-span-2 row-span-2",
    aspect: "aspect-square",
  },
  {
    src: "/gallery/img-2.png",
    alt: "Classic gentleman cut",
    style: "Classic Gentleman",
    note: "Timeless structure",
    span: "col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/gallery/img-3.png",
    alt: "Luxury shave experience",
    style: "The Ritual Shave",
    note: "Hot towel + straight razor",
    span: "col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/gallery/img-4.png",
    alt: "Modern executive cut",
    style: "Executive Cut",
    note: "Sharp, defined, professional",
    span: "col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/gallery/img-5.png",
    alt: "Beard sculpting service",
    style: "Beard Sculpt",
    note: "Defined lines, conditioned finish",
    span: "col-span-1",
    aspect: "aspect-[4/5]",
  },
  {
    src: "/gallery/img-1.png",
    alt: "Signature style",
    style: "Signature Style",
    note: "Crafted to your face shape",
    span: "col-span-2",
    aspect: "aspect-[16/9]",
  },
];

const TransformationsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="transformations"
      className="py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#f8f5f0" }}
      aria-label="Haircut and grooming portfolio"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Portfolio
            </span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2
              className="font-playfair text-3xl md:text-5xl text-luxury-midnight max-w-md"
              style={{ lineHeight: "1.15" }}
            >
              The Work Speaks
              <span className="italic"> for Itself.</span>
            </h2>
            <p className="font-outfit text-luxury-graphite/50 text-sm max-w-xs leading-relaxed lg:text-right">
              Every cut is documented. Every style is intentional. Every client
              leaves with something worth looking at.
            </p>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Large featured image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7 }}
            className="col-span-2 row-span-2 group relative overflow-hidden cursor-pointer"
          >
            <div className="relative w-full aspect-square overflow-hidden bg-luxury-charcoal">
              <Image
                src={transformations[0].src}
                alt={transformations[0].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/60 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-luxury-midnight/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-luxury-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="absolute bottom-5 left-5">
                <p className="font-playfair text-luxury-ivory text-xl italic">
                  {transformations[0].style}
                </p>
                <p
                  className="font-mono text-luxury-amber/70 text-xs mt-1 uppercase"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {transformations[0].note}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Smaller images */}
          {transformations.slice(1, 5).map((t, i) => (
            <motion.div
              key={t.src}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1 }}
              className="group relative overflow-hidden cursor-pointer"
            >
              <div className="relative w-full aspect-[4/5] bg-luxury-charcoal">
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={80}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/70 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-luxury-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-playfair text-luxury-ivory text-sm italic opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t.style}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Wide image at bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="col-span-2 group relative overflow-hidden cursor-pointer"
          >
            <div className="relative w-full aspect-[16/9] bg-luxury-charcoal">
              <Image
                src={transformations[5].src}
                alt={transformations[5].alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-luxury-midnight/60 via-transparent to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-luxury-amber scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <div className="absolute bottom-5 left-6">
                <p className="font-playfair text-luxury-ivory text-lg italic">
                  {transformations[5].style}
                </p>
                <p
                  className="font-mono text-luxury-amber/60 text-xs mt-1 uppercase"
                  style={{ letterSpacing: "0.18em" }}
                >
                  {transformations[5].note}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 text-center"
        >
          <button
            onClick={openBooksyWidget}
            className="group inline-flex items-center gap-3 font-outfit text-luxury-midnight text-sm uppercase border-b border-luxury-midnight pb-1 hover:border-luxury-amber hover:text-luxury-whiskey transition-all duration-300"
            style={{ letterSpacing: "0.12em" }}
          >
            Book your transformation
            <ArrowRight
              size={14}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TransformationsSection;
