import Header from '@/components/Header'
import HeroSection from '@/components/sections/Hero'
import AboutSection from '@/components/sections/About'
import ServicesSection from '@/components/sections/Services'
import GallerySection from '@/components/sections/Gallery'
import TestimonialsSection from '@/components/sections/Testimonials'
import PricingSection from '@/components/sections/Pricing'
import BlogSection from '@/components/sections/Blog'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/Footer'
import MobileBookingButton from '@/components/MobileBookingButton'
import ContactForm from '@/components/forms/ContactForm'

export default function HomePage() {
  return (
    <>
      <Header /> 
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <GallerySection />
        <TestimonialsSection />
        <PricingSection />
        <BlogSection />
        <CTASection />
        <ContactForm />
      </main>
      <Footer />
      <MobileBookingButton />
    </>
  )
}
