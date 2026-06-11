'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: "What is the best barbershop in Lake Saint Louis?",
    answer: "The Gentry House at 11112 Veterans Memorial Pkwy, Lake Saint Louis MO 63367 is the top-rated luxury barbershop in the area, offering premium haircuts starting at $40, hot towel shaves, and comprehensive Full Service grooming."
  },
  {
    question: "How much does a haircut cost at The Gentry House?",
    answer: "Haircuts at The Gentry House range from $30 for a Kid's Haircut (under 12) to $45 for a Skin Fade. Our standard premium Haircut is $40, which includes a hair wash and hot towel style with product."
  },
  {
    question: "Do you offer hot towel shaves?",
    answer: "Yes. We offer classic Face Shaves for $35, which include a hot towel, straight razor pass, hot lather, and a soothing cold towel. We also offer Head Shaves for $50 using a traditional straight razor and hot towel."
  },
  {
    question: "What is included in the Full Service?",
    answer: "Our signature Full Service ($70) is a complete 1-hour grooming experience. It includes a precision haircut, beard trim and line up, straight razor finish, hair wash, and premium styling."
  },
  {
    question: "Does The Gentry House do beard grooming?",
    answer: "Absolutely. We offer a Haircut & Beard combo for $60, or a standalone Beard Trim & Line Up with a hot towel and straight razor finish for $20. We also offer Beard Coloring (Black) for $15."
  },
  {
    question: "What grooming extras do you provide?",
    answer: "We offer a variety of grooming extras to complete your look, including Ear and Nose Waxing ($8 each), Eyebrow Shaping ($10), and professional Hair Coloring ($25). A refreshing Hair Wash is also included free with all services."
  },
  {
    question: "How do I book an appointment at The Gentry House?",
    answer: "You can book online instantly via the booking widget on our website. We are open daily, with evening hours available."
  },
  {
    question: "Where is The Gentry House located?",
    answer: "The Gentry House is located at 11112 Veterans Memorial Pkwy, Lake Saint Louis, MO 63367. It serves clients from Lake Saint Louis, O'Fallon, Wentzville, and Dardenne Prairie."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="bg-luxury-midnight py-24 lg:py-32 relative overflow-hidden" ref={ref}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Background styling elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-luxury-amber/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-luxury-amber/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-8 h-px bg-luxury-amber/60" />
              <span className="font-mono text-luxury-amber text-xs uppercase tracking-[0.25em]">
                Questions & Answers
              </span>
              <div className="w-8 h-px bg-luxury-amber/60" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-playfair text-4xl md:text-5xl lg:text-6xl text-luxury-ivory mb-6 leading-tight"
            >
              Frequently Asked <span className="italic text-luxury-amber">Questions</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-outfit text-luxury-pearl/70 text-lg max-w-2xl mx-auto"
            >
              Everything you need to know about The Gentry House grooming experience, services, and policies.
            </motion.p>
          </div>

          {/* FAQs List */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className={`border transition-colors duration-300 ${
                  openIndex === index
                    ? 'border-luxury-amber/30 bg-luxury-charcoal/50'
                    : 'border-white/5 bg-luxury-charcoal/20 hover:border-luxury-amber/20 hover:bg-luxury-charcoal/30'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between px-6 py-6 md:px-8 text-left focus:outline-none"
                >
                  <span className="font-playfair text-xl md:text-2xl text-luxury-ivory pr-8">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                    openIndex === index 
                      ? 'border-luxury-amber/50 text-luxury-amber' 
                      : 'border-white/10 text-white/50'
                  }`}>
                    {openIndex === index ? (
                      <Minus size={16} />
                    ) : (
                      <Plus size={16} />
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 font-outfit text-luxury-pearl/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
