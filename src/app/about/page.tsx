import { motion } from "framer-motion";
import { openBooksyWidget } from "@/lib/utils";
import {
  Scissors,
  Sparkles,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Users,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TestimonialsSection from "@/components/sections/Testimonials";

// Add framer motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutPage() {
  return (
    <main className="bg-[#F8F5F0]">
      {/* 1. Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/tgh-seats.jpeg"
            alt="The Gentry House Interior"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-luxury-midnight/70" />
        </div>

        <div className="relative z-10 max-w-luxury mx-auto px-6 lg:px-12 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-mono text-luxury-amber text-xs md:text-sm uppercase tracking-[0.2em] mb-4">
              Welcome to TGH
            </span>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl text-luxury-ivory mb-6 leading-tight max-w-4xl mx-auto">
              More Than a Haircut.
              <br />
              <span className="italic text-luxury-amber">
                A Grooming Experience.
              </span>
            </h1>
            <p className="font-outfit text-luxury-ivory/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Premium barbering, luxury service, and a modern atmosphere built
              for gentlemen who value looking their best.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openBooksyWidget}
                className="w-full sm:w-auto px-8 py-4 bg-luxury-amber text-luxury-midnight font-outfit text-sm uppercase tracking-widest hover:bg-luxury-ivory transition-colors duration-300"
              >
                Book Appointment
              </button>
              <Link
                href="/#services"
                className="w-full sm:w-auto px-8 py-4 border border-luxury-amber text-luxury-amber font-outfit text-sm uppercase tracking-widest hover:bg-luxury-amber hover:text-luxury-midnight transition-colors duration-300"
              >
                View Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-24 md:py-32 bg-luxury-ivory">
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-luxury-amber" />
                <span className="font-mono text-luxury-amber text-xs uppercase tracking-widest">
                  Our Story
                </span>
              </div>
              <h2 className="font-playfair text-3xl md:text-5xl text-luxury-charcoal mb-8 leading-tight">
                A Vision Built on <br />
                <span className="italic text-luxury-amber">
                  Gentleman Standards
                </span>
              </h2>
              <div className="space-y-6 font-outfit text-luxury-charcoal/80 text-base md:text-lg leading-relaxed">
                <p>
                  The Gentry House was founded with a simple vision: to create a
                  barbershop experience that goes beyond the haircut.
                </p>
                <p>
                  In a world where rushed appointments and crowded shops have
                  become the norm, we set out to build a space where every
                  client receives personalized attention, precision
                  craftsmanship, and a premium grooming experience from start to
                  finish.
                </p>
                <p>
                  Located in Lake Saint Louis, Missouri, The Gentry House
                  combines modern barbering techniques with timeless gentleman
                  standards. From skin fades and beard sculpting to hot towel
                  treatments and luxury grooming services, every detail is
                  designed to help our clients look sharp, feel confident, and
                  leave feeling their absolute best.
                </p>
                <p className="font-medium text-luxury-amber border-l-2 border-luxury-amber pl-4 italic">
                  At TGH, we believe a great haircut is more than maintenance —
                  it's part of how you present yourself to the world.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] lg:aspect-auto lg:h-[600px] w-full"
            >
              <Image
                src="/about/grand-opening.jpeg"
                alt="TGH Grand Opening"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 border border-luxury-amber/30 m-4 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. What Makes TGH Different */}
      <section className="py-24 md:py-32 bg-luxury-charcoal">
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="font-playfair text-3xl md:text-5xl text-luxury-ivory mb-6">
              What Makes <span className="italic text-luxury-amber">TGH</span>{" "}
              Different
            </h2>
            <div className="w-16 h-px bg-luxury-amber mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Precision Barbering",
                desc: "Every haircut is personalized to your face shape, hair type, and personal style.",
                icon: Scissors,
              },
              {
                title: "Luxury Experience",
                desc: "Complimentary hot towel service, attention to detail, and premium customer care.",
                icon: Sparkles,
              },
              {
                title: "Consistency",
                desc: "The same high standards on every visit. Dependable quality you can trust.",
                icon: CheckCircle2,
              },
              {
                title: "Community",
                desc: "A welcoming environment where clients become part of the TGH family.",
                icon: Users,
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-luxury-graphite p-8 border border-luxury-graphite/50 hover:border-luxury-amber/30 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-luxury-midnight border border-luxury-amber/20 flex items-center justify-center mb-6">
                  <feature.icon className="text-luxury-amber w-6 h-6" />
                </div>
                <h3 className="font-playfair text-xl text-luxury-ivory mb-3">
                  {feature.title}
                </h3>
                <p className="font-outfit text-luxury-pearl/70 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our Mission & 7. Community & Culture combined */}
      <section className="py-24 md:py-32 bg-luxury-amber text-luxury-midnight relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#1A1A1A 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="space-y-16"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest block mb-4">
                Our Mission
              </span>
              <h3 className="font-playfair text-2xl md:text-4xl leading-relaxed">
                "To elevate the grooming experience by combining exceptional
                barbering, premium service, and genuine hospitality. We strive
                to help every client leave our chair looking sharper, feeling
                more confident, and ready to take on whatever comes next."
              </h3>
            </div>

            <div className="w-24 h-px bg-luxury-midnight/20 mx-auto" />

            <div>
              <span className="font-mono text-xs uppercase tracking-widest block mb-4">
                Community & Culture
              </span>
              <p className="font-outfit text-lg md:text-xl leading-relaxed text-luxury-midnight/80">
                The Gentry House is more than a barbershop. We're proud to serve
                the Lake Saint Louis community and create an environment where
                clients of all ages feel welcomed, respected, and valued.
                Whether it's a young gentleman getting his first haircut or a
                professional preparing for an important meeting, our goal
                remains the same: deliver an experience worth coming back for.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. The TGH Experience - Visual Timeline */}
      <section className="py-24 md:py-32 bg-[#F8F5F0]">
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          <div className="text-center mb-20">
            <h2 className="font-playfair text-3xl md:text-5xl text-luxury-charcoal mb-6">
              The <span className="italic text-luxury-amber">TGH</span>{" "}
              Experience
            </h2>
            <p className="font-outfit text-luxury-charcoal/70 max-w-2xl mx-auto">
              A step-by-step look at what to expect when you sit in our chair.
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-luxury-amber/30 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { step: "1", title: "Arrival & Consultation" },
                { step: "2", title: "Precision Haircut" },
                { step: "3", title: "Detail Work & Styling" },
                { step: "4", title: "Complimentary Hot Towel Service" },
                { step: "5", title: "Final Touches & Boost" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#F8F5F0] border-2 border-luxury-amber flex items-center justify-center mb-6 shadow-lg z-10 text-luxury-amber font-playfair text-xl">
                    {item.step}
                  </div>
                  <h4 className="font-playfair text-lg text-luxury-charcoal leading-tight">
                    {item.title}
                  </h4>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Section */}
      <section className="py-24 md:py-32 bg-luxury-charcoal text-luxury-ivory">
        <div className="max-w-luxury mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-3xl md:text-5xl mb-6">
              Trusted By{" "}
              <span className="italic text-luxury-amber">Hundreds</span> Of
              Clients
            </h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-6 h-6 fill-luxury-amber text-luxury-amber"
                />
              ))}
            </div>
            <p className="font-mono text-luxury-pearl/60 text-sm uppercase tracking-widest">
              Across The US
            </p>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { name: 'Michael R.', source: 'Google', quote: 'Best barbershop in Lake Saint Louis. The attention to detail is unmatched, and the hot towel finish is amazing.' },
              { name: 'David S.', source: 'Booksy', quote: 'True professionals. They listen to what you want and deliver exactly that. Atmosphere is top tier.' },
              { name: 'James T.', source: 'Google', quote: 'Found my new spot. The fade was flawless, and the guys make you feel right at home from the minute you walk in.' }
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-luxury-graphite p-8 relative"
              >
                <div className="absolute top-0 right-0 bg-luxury-amber text-luxury-midnight text-xs font-mono px-3 py-1 uppercase font-bold">
                  {review.source}
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-luxury-amber text-luxury-amber" />
                  ))}
                </div>
                <p className="font-outfit text-luxury-pearl/80 italic mb-6">"{review.quote}"</p>
                <p className="font-playfair text-luxury-amber">— {review.name}</p>
              </motion.div>
            ))}
          </div> */}
          <TestimonialsSection />

          <div className="text-center mt-10">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-3 text-luxury-amber hover:text-luxury-ivory transition-colors font-outfit uppercase tracking-widest text-sm"
            >
              View Before & After Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/about/about-3.jpg"
            alt="Barber Tools"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-luxury-midnight/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="font-playfair text-4xl md:text-6xl text-luxury-ivory mb-6">
              Ready For Your{" "}
              <span className="italic text-luxury-amber">Next Cut?</span>
            </h2>
            <p className="font-outfit text-xl text-luxury-pearl/80 mb-10">
              Experience premium grooming at The Gentry House.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-12 mb-12 text-luxury-ivory font-outfit">
              <li className="flex text-center justify-center md:justify-start gap-3">
                <MapPin
                  className="text-luxury-amber w-5 h-5"
                />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=11112+Veterans+Memorial+Pkwy,+Lake+Saint+Louis,+MO+63367"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  11112 Veterans Memorial Pkwy,
                  <br />
                  Lake Saint Louis, 63367
                </a>
              </li>
              <div className="flex items-center gap-3">
                <Check className="text-luxury-amber w-5 h-5" />
                <span>Precision Haircuts</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="text-luxury-amber w-5 h-5" />
                <span>Hot Towel Service</span>
              </div>
            </div>

            <button
              onClick={openBooksyWidget}
              className="px-10 py-5 bg-luxury-amber text-luxury-midnight font-outfit text-sm uppercase tracking-[0.2em] hover:bg-luxury-ivory transition-all duration-300 shadow-[0_0_30px_rgba(200,155,60,0.3)] hover:shadow-[0_0_40px_rgba(200,155,60,0.5)]"
            >
              Book Appointment
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
