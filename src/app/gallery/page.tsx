"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";

const galleryImages = [
  {
    src: "/gallery/img-7.png",
    alt: "Master stylist at work in luxury grooming studio",
    label: "The Studio",
    span: "wide",
  },
  {
    src: "/gallery/img-2.png",
    alt: "Premium grooming tools on marble surface",
    label: "Tools of the Trade",
    span: "standard",
  },
  {
    src: "/gallery/img-3.png",
    alt: "Luxury shave experience in progress",
    label: "The Ritual",
    span: "standard",
  },
  {
    src: "/gallery/img-4.png",
    alt: "Executive grooming session",
    label: "Executive Suite",
    span: "standard",
  },
  {
    src: "/gallery/img-5.png",
    alt: "Signature beard sculpting service",
    label: "Precision Beard Work",
    span: "standard",
  },
  {
    src: "/gallery/img-1.png",
    alt: "Classic haircut in progress",
    label: "The Classic Cut",
    span: "standard",
  },
  {
    src: "/gallery/img-8.png",
    alt: "Premium product selection",
    label: "Curated Selection",
    span: "wide",
  },
  {
    src: "/gallery/img-9.png",
    alt: "Final result — refined gentleman",
    label: "The Finish",
    span: "standard",
  },
  {
    src: "/about/grand-opening.jpeg",
    alt: "Premium barbershop interior ambiance",
    label: "The Atmosphere",
    span: "standard",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function GallerySection() {
  const [selected, setSelected] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const prev = useCallback(() => {
    setSelected((i) =>
      i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length,
    );
  }, []);

  const next = useCallback(() => {
    setSelected((i) => (i === null ? null : (i + 1) % galleryImages.length));
  }, []);

  const close = useCallback(() => setSelected(null), []);

  // Keyboard navigation
  useEffect(() => {
    if (selected === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selected, prev, next, close]);

  // Lock scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = selected !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section
      id="gallery"
      className="bg-luxury-midnight py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-14 lg:mb-18"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-luxury-amber" />
            <span
              className="font-mono text-luxury-amber text-xs uppercase"
              style={{ letterSpacing: "0.25em" }}
            >
              Gallery
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <h2
              className="font-playfair text-3xl md:text-4xl lg:text-5xl text-luxury-ivory"
              style={{ lineHeight: "1.15" }}
            >
              Inside <span className="italic text-luxury-amber">The House</span>
            </h2>

            <p className="font-outfit text-luxury-pearl/40 text-sm max-w-xs leading-relaxed lg:text-right">
              Step inside our premium studio — where craftsmanship, atmosphere,
              and luxury converge.
            </p>
          </div>
        </motion.div>

        {/* ── Masonry-style Editorial Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4"
        >
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              onClick={() => setSelected(i)}
              className={`group relative overflow-hidden cursor-pointer bg-luxury-charcoal ${
                img.span === "wide" ? "col-span-2" : "col-span-1"
              }`}
            >
              {/* Image */}
              <div
                className={`relative w-full overflow-hidden ${
                  img.span === "wide" ? "aspect-[16/10]" : "aspect-[4/5]"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes={
                    img.span === "wide"
                      ? "(max-width: 1024px) 100vw, 100vw "
                      : "(max-width: 1024px) 50vw, 33vw"
                  }
                  priority={i < 3}
                />
              </div>

              {/* Base gradient — always present for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-midnight/60 via-transparent to-transparent pointer-events-none" />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-luxury-midnight/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top-right — index number */}
              <div
                className="absolute top-4 right-4 font-mono text-luxury-amber/0 group-hover:text-luxury-amber/60 text-xs transition-all duration-300"
                style={{ letterSpacing: "0.15em" }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </div>

              {/* Top-left amber line reveal */}
              <div className="absolute top-0 left-0 h-0.5 w-0 bg-luxury-amber group-hover:w-full transition-all duration-500 ease-out" />

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                {/* Label */}
                <span
                  className="font-mono text-luxury-ivory/0 group-hover:text-luxury-ivory/70 text-xs uppercase translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {img.label}
                </span>

                {/* Expand icon */}
                <div className="w-9 h-9 flex items-center justify-center border border-luxury-ivory/0 group-hover:border-luxury-amber/50 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                  <Expand size={14} className="text-luxury-amber" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Total count ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-8 flex items-center justify-end gap-3"
        >
          <div className="w-10 h-px bg-luxury-graphite" />
          <span
            className="font-mono text-luxury-pearl/25 text-xs uppercase"
            style={{ letterSpacing: "0.2em" }}
          >
            {galleryImages.length} Works
          </span>
        </motion.div>
      </div>


      {/* ── Lightbox ── */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: "rgba(13,13,13,0.97)",
              backdropFilter: "blur(12px)",
            }}
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            {/* Ambient amber glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(201,169,98,0.04) 0%, transparent 70%)",
              }}
            />

            {/* Close */}
            <button
              onClick={close}
              className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center border border-luxury-ivory/10 text-luxury-pearl/50 hover:border-luxury-amber/50 hover:text-luxury-amber transition-all duration-300"
              aria-label="Close lightbox"
            >
              <X size={16} />
            </button>

            {/* Image wrapper */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-5xl mx-6 max-h-[80vh] flex flex-col"
              >
                {/* Main image */}
                <div
                  className="relative border border-luxury-graphite overflow-hidden"
                  style={{ maxHeight: "70vh" }}
                >
                  <Image
                    src={galleryImages[selected].src}
                    alt={galleryImages[selected].alt}
                    width={1200}
                    height={750}
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "70vh" }}
                    priority
                  />
                  {/* Thin amber top border */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-luxury-amber/40" />
                </div>

                {/* Lightbox meta bar */}
                <div className="flex items-center justify-between mt-4 px-1">
                  {/* Label */}
                  <div>
                    <span
                      className="font-mono text-luxury-amber/60 text-xs uppercase"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {galleryImages[selected].label}
                    </span>
                  </div>

                  {/* Progress dots */}
                  <div className="flex items-center gap-2">
                    {galleryImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(i);
                        }}
                        className={`transition-all duration-400 ${
                          i === selected
                            ? "w-6 h-0.5 bg-luxury-amber"
                            : "w-1.5 h-0.5 bg-luxury-ivory/15 hover:bg-luxury-ivory/35"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                        aria-current={i === selected}
                      />
                    ))}
                  </div>

                  {/* Counter */}
                  <span
                    className="font-mono text-luxury-pearl/30 text-xs"
                    style={{ letterSpacing: "0.1em" }}
                  >
                    {String(selected + 1).padStart(2, "0")}&nbsp;/&nbsp;
                    {String(galleryImages.length).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center border border-luxury-ivory/10 text-luxury-pearl/40 hover:border-luxury-amber/50 hover:text-luxury-amber transition-all duration-300 hover:scale-105"
              aria-label="Previous image"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Next arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center border border-luxury-ivory/10 text-luxury-pearl/40 hover:border-luxury-amber/50 hover:text-luxury-amber transition-all duration-300 hover:scale-105"
              aria-label="Next image"
            >
              <ArrowRight size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
