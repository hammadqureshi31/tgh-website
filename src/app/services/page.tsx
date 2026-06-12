import { Metadata } from 'next'
import ServicesHero from '@/components/sections/ServicesHero'
import ServicesGrid from '@/components/sections/ServicesGrid'
import PricingSection from '@/components/sections/Pricing'
import TestimonialsSection from '@/components/sections/Testimonials'
import CTASection from '@/components/sections/CTASection'
import React from 'react'

export const metadata: Metadata = {
  title: 'Premium Grooming Services | TGH Barber',
  description: 'Explore our comprehensive menu of premium grooming services including precision haircuts, hot towel shaves, and complete styling at TGH Barber.',
  openGraph: {
    title: 'Premium Grooming Services | TGH Barber',
    description: 'Explore our comprehensive menu of premium grooming services including precision haircuts, hot towel shaves, and complete styling at TGH Barber.',
    url: 'https://thegentryhouse.com/services', // Update with actual URL if known
  },
}

export default function ServicesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    provider: {
      '@type': 'LocalBusiness',
      name: 'TGH Barber',
      image: 'https://thegentryhouse.com/logo/tgh-logo.png' // Adjust to the actual logo path
    },
    serviceType: ['Haircut', 'Shave & Beard', 'Grooming Extras'],
    areaServed: {
      '@type': 'City',
      name: 'TGH City' // Update with actual city if known
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Barber Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Haircut'
          },
          price: '40.00',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Haircut & beard'
          },
          price: '60.00',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Full service'
          },
          price: '70.00',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Head shave'
          },
          price: '50.00',
          priceCurrency: 'USD'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Face Shave'
          },
          price: '35.00',
          priceCurrency: 'USD'
        }
      ]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-luxury-midnight">
        <ServicesHero />
        <ServicesGrid />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
    </>
  )
}
