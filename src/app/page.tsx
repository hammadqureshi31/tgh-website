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
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const { data: featuredPosts } = await supabase
    .from('blog_posts')
    .select('*, authors(name, avatar_url), categories(name, slug)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(3)

  return (
    <>
      {/* <Header />  */}
      <main>
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TestimonialsSection />
        <PricingSection />
        <GallerySection />
        <BlogSection featuredPosts={featuredPosts || undefined} />
        <CTASection />
        <ContactForm />
      </main>
      <Footer />
      <MobileBookingButton />
    </>
  )
}

