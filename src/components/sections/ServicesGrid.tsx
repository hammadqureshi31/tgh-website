'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Check, Star } from 'lucide-react'
import { openBooksyWidget } from '@/lib/utils'

interface Service {
  id: string
  category: string
  name: string
  price: string
  duration: string
  description: string
  features: string[]
}

const services: Service[] = [
  // Popular Services
  {
    id: 'haircut',
    category: 'Popular Services',
    name: "Haircut",
    price: "$40",
    duration: "30min",
    description: "Hair wash & Hot Towel Style with product.",
    features: ["Hair wash included", "Hot towel treatment", "Professional styling", "Premium product application"]
  },
  {
    id: 'haircut-beard',
    category: 'Popular Services',
    name: "Haircut & beard",
    price: "$60",
    duration: "45min",
    description: "Complete haircut and beard grooming session.",
    features: ["Hair wash included", "Hot towel treatment", "Beard shaping", "Professional styling"]
  },
  {
    id: 'kids-haircut',
    category: 'Popular Services',
    name: "Kid's Haircut (Under 12)",
    price: "$30",
    duration: "30min",
    description: "Professional haircut for children under 12.",
    features: ["Gentle hair wash", "Hot towel", "Age-appropriate style"]
  },
  {
    id: 'full-service',
    category: 'Popular Services',
    name: "Full service",
    price: "$70",
    duration: "1 hour",
    description: "The ultimate grooming experience. Hair, beard, and straight razor work.",
    features: ["Haircut", "Beard trim & line up", "Straight razor edge", "Wash & style"]
  },
  {
    id: 'skin-fade',
    category: 'Popular Services',
    name: "Skin Fade",
    price: "$45",
    duration: "30min",
    description: "Precision skin fade haircut.",
    features: ["Zero fade", "Precise blending", "Line up included"]
  },
  // Shave & Beard
  {
    id: 'head-shave',
    category: 'Shave & Beard',
    name: "Head shave",
    price: "$50",
    duration: "30min",
    description: "Smooth head shave using a straight razor.",
    features: ["Hot towel prep", "Lather application", "Straight razor shave"]
  },
  {
    id: 'face-shave',
    category: 'Shave & Beard',
    name: "Face Shave",
    price: "$35",
    duration: "30min",
    description: "Traditional hot lather straight razor face shave.",
    features: ["Hot towel prep", "Straight razor shave", "Hot lather", "Cold towel finish"]
  },
  {
    id: 'beard-trim',
    category: 'Shave & Beard',
    name: "Beard trim and line up",
    price: "$20",
    duration: "15min",
    description: "Quick beard maintenance and sharp line up.",
    features: ["Beard trimming", "Straight razor line up", "Hot towel prep"]
  },
  {
    id: 'beard-color',
    category: 'Shave & Beard',
    name: "Beard color (Black)",
    price: "$15",
    duration: "20min",
    description: "Professional beard coloring service (Black only).",
    features: ["Even color application", "Black shade", "Gentle on skin"]
  },
  {
    id: 'hair-color',
    category: 'Shave & Beard',
    name: "Hair color (Black)",
    price: "$25",
    duration: "30min",
    description: "Professional hair coloring service (Black only).",
    features: ["Full coverage", "Black shade", "Wash included"]
  },
  // Grooming Extras
  {
    id: 'eyebrow-shaping',
    category: 'Grooming Extras',
    name: "Eyebrow Shaping",
    price: "$10",
    duration: "10min",
    description: "Precise eyebrow shaping.",
    features: ["Straight razor precision", "Shape mapping"]
  },
  {
    id: 'ear-wax',
    category: 'Grooming Extras',
    name: "Ear wax",
    price: "$8",
    duration: "10min",
    description: "Quick and safe ear waxing.",
    features: ["Painless removal", "Quick service"]
  },
  {
    id: 'nose-wax',
    category: 'Grooming Extras',
    name: "Nose wax",
    price: "$8",
    duration: "10min",
    description: "Quick and safe nose waxing.",
    features: ["Painless removal", "Quick service"]
  },
  {
    id: 'eyebrow',
    category: 'Grooming Extras',
    name: "Eyebrow",
    price: "$8",
    duration: "10min",
    description: "Standard eyebrow clean up.",
    features: ["Quick clean up", "Natural look"]
  },
  {
    id: 'hair-wash',
    category: 'Grooming Extras',
    name: "Hair wash",
    price: "FREE",
    duration: "5min",
    description: "FREE for all services.",
    features: ["Shampoo", "Conditioner", "Scalp massage"]
  }
]

const categories = ['All Services', 'Popular Services', 'Shave & Beard', 'Grooming Extras']

export default function ServicesGrid() {
  const [activeTab, setActiveTab] = useState('All Services')
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const filteredServices = activeTab === 'All Services' 
    ? services 
    : services.filter(s => s.category === activeTab)

  return (
    <section id="services-grid" className="py-24 bg-luxury-ivory" style={{ backgroundColor: '#f8f5f0' }}>
      <div className="max-w-luxury mx-auto px-6 lg:px-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl md:text-5xl text-luxury-midnight mb-6">
            Our Menu
          </h2>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-luxury-amber/30 w-16" />
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rotate-45 bg-luxury-amber" />
            </div>
            <div className="h-px bg-luxury-amber/30 w-16" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 font-outfit text-sm tracking-wide transition-all duration-300 ${
                activeTab === cat 
                  ? 'bg-luxury-midnight text-luxury-ivory shadow-lg scale-105' 
                  : 'bg-transparent text-luxury-graphite hover:text-luxury-midnight hover:bg-black/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={service.id}
                onClick={() => setSelectedService(service)}
                className="group cursor-pointer bg-white p-8 hover:shadow-xl transition-all duration-300 border border-black/5 hover:border-luxury-amber/30 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-luxury-amber text-xs font-mono uppercase tracking-widest mb-2 block">
                      {service.category}
                    </span>
                    <h3 className="font-playfair text-xl text-luxury-midnight group-hover:text-luxury-amber transition-colors">
                      {service.name}
                    </h3>
                  </div>
                  <span className="font-playfair text-2xl text-luxury-midnight">
                    {service.price}
                  </span>
                </div>
                
                <p className="font-outfit text-luxury-graphite/70 text-sm mb-6 flex-grow line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-black/5">
                  <div className="flex items-center gap-2 text-luxury-graphite/60 text-sm">
                    <Clock size={14} />
                    <span>{service.duration}</span>
                  </div>
                  <span className="text-luxury-midnight text-xs font-mono uppercase tracking-widest group-hover:text-luxury-amber transition-colors flex items-center gap-1">
                    Details
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-luxury-midnight/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white shadow-2xl z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-luxury-midnight p-8 md:p-12 relative text-center">
                <button 
                  onClick={() => setSelectedService(null)}
                  className="absolute top-6 right-6 text-luxury-pearl/50 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <span className="text-luxury-amber text-xs font-mono uppercase tracking-widest mb-3 block">
                  {selectedService.category}
                </span>
                <h3 className="font-playfair text-3xl md:text-4xl text-luxury-ivory mb-4">
                  {selectedService.name}
                </h3>
                <div className="flex items-center justify-center gap-4 text-luxury-ivory/80">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="font-outfit">{selectedService.duration}</span>
                  </div>
                  <span className="text-luxury-amber/50">•</span>
                  <span className="font-playfair text-2xl text-luxury-amber">{selectedService.price}</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 md:p-12">
                <p className="font-outfit text-luxury-graphite/80 text-lg leading-relaxed mb-8 text-center">
                  {selectedService.description}
                </p>

                <div className="mb-10">
                  <h4 className="font-mono text-luxury-midnight text-xs uppercase tracking-widest mb-4 flex items-center gap-2 justify-center">
                    <Star size={12} className="text-luxury-amber" />
                    What's Included
                    <Star size={12} className="text-luxury-amber" />
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                    {selectedService.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-luxury-graphite">
                        <Check size={16} className="text-luxury-amber shrink-0 mt-0.5" />
                        <span className="font-outfit text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => {
                      setSelectedService(null)
                      openBooksyWidget()
                    }}
                    className="inline-flex items-center justify-center gap-3 px-12 py-4 bg-luxury-amber text-luxury-midnight font-outfit text-sm uppercase tracking-wide hover:bg-luxury-whiskey transition-all duration-300 shadow-[0_0_20px_rgba(201,169,98,0.2)] hover:shadow-[0_0_30px_rgba(201,169,98,0.4)]"
                  >
                    Book This Service
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
