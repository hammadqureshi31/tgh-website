"use client";

import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useRef } from "react";

const LocalSEOSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#f8f5f0" }}
      aria-label="The Gentry House serving Lake Saint Louis and St. Charles County"
    >
      <div className="max-w-luxury mx-auto px-6 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: eyebrow + headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-px bg-luxury-amber" />
              <span
                className="font-mono text-luxury-amber text-xs uppercase"
                style={{ letterSpacing: "0.25em" }}
              >
                Your Area
              </span>
            </div>
            <h2
              className="font-playfair text-3xl md:text-4xl text-luxury-midnight"
              style={{ lineHeight: "1.2" }}
            >
              Rooted in
              <br />
              <span className="italic">Lake Saint Louis.</span>
            </h2>

            {/* Map CTA */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=11112+Veterans+Memorial+Pkwy,+Lake+Saint+Louis,+MO+63367"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 mt-8 font-outfit text-luxury-midnight text-sm uppercase border-b border-luxury-midnight/20 pb-1 hover:border-luxury-amber hover:text-luxury-whiskey transition-all duration-300"
              style={{ letterSpacing: "0.1em" }}
            >
              <MapPin size={13} />
              Get Directions
              <ArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
          </motion.div>

          {/* Right: body copy + info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            <p className="font-outfit text-luxury-graphite/70 text-base leading-relaxed">
              The Gentry House is on Veterans Memorial Pkwy in Lake Saint Louis,
              MO — positioned to serve professionals and residents across the
              broader St. Charles County corridor. Whether you are coming from
              O&apos;Fallon, Wentzville, Cottleville, or St. Peters, you are
              within a short drive of a grooming experience that treats your
              time as the valuable thing it is.
            </p>
            <p className="font-outfit text-luxury-graphite/70 text-base leading-relaxed">
              Lake Saint Louis has a growing base of professionals who expect
              precision — in their work, in their environments, and in how they
              look. TGH was built for that expectation. Our pricing is honest,
              our standard is consistent, and our location is practical. No
              commuting to Clayton or Ladue for a premium cut when the same
              quality is twenty minutes from where you already are.
            </p>
            <p className="font-outfit text-luxury-graphite/70 text-base leading-relaxed">
              Walk-ins are welcome. Appointments are smarter. Either way, we are
              here Monday through Sunday — open earlier than most, closing later
              on weekends.
            </p>

            {/* Address + Hours info block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-luxury-pearl">
              <div>
                <div
                  className="font-mono text-luxury-amber text-xs uppercase mb-2"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Address
                </div>
                <p className="font-outfit text-luxury-graphite/70 text-sm leading-relaxed">
                  11112 Veterans Memorial Pkwy
                  <br />
                  Lake Saint Louis, MO 63367
                </p>
              </div>
              <div>
                <div
                  className="font-mono text-luxury-amber text-xs uppercase mb-2"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Phone
                </div>
                <a
                  href="tel:+16362650109"
                  className="font-outfit text-luxury-graphite/70 text-sm hover:text-luxury-whiskey transition-colors"
                >
                  +1 (636) 265-0109
                </a>
              </div>
              <div>
                <div
                  className="font-mono text-luxury-amber text-xs uppercase mb-2"
                  style={{ letterSpacing: "0.2em" }}
                >
                  Hours
                </div>
                <p className="font-outfit text-luxury-graphite/70 text-sm leading-relaxed">
                  Mon–Thu: 9 AM – 8 PM
                  <br />
                  Fri–Sat: 9 AM – 9 PM
                  <br />
                  Sun: 9 AM – 7 PM
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LocalSEOSection;
