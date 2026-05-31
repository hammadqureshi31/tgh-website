import Header from '@/components/Header'
import HeroSection from '@/components/sections/Hero'
import AboutSection from '@/components/sections/About'
import ServicesSection from '@/components/sections/Services'
import TestimonialsSection from '@/components/sections/Testimonials'
import PricingSection from '@/components/sections/Pricing'
import BlogSection from '@/components/sections/Blog'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/Footer'
import MobileBookingButton from '@/components/MobileBookingButton'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TestimonialsSection />
        <PricingSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
      <MobileBookingButton />
    </>
  )
}
