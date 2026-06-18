import { Metadata } from 'next'
import CareersHero from '@/components/careers/CareersHero'
import CareersWhyTGH from '@/components/careers/CareersWhyTGH'
import CareersPositions from '@/components/careers/CareersPositions'
import CareersGrowthPath from '@/components/careers/CareersGrowthPath'
import CareersCulture from '@/components/careers/CareersCulture'
import CareersLocations from '@/components/careers/CareersLocations'
import CareersTestimonials from '@/components/careers/CareersTestimonials'
import CareerApplicationForm from '@/components/forms/CareerApplicationForm'
import { CAREER_POSITION_DESCRIPTIONS, OPEN_ROLES, getLocationById } from '@/lib/careers'

export const metadata: Metadata = {
  title: 'Barber Careers | Join The Gentry House Team',
  description:
    'Join The Gentry House team and build your barbering career in a premium environment.',
  openGraph: {
    title: 'Barber Careers | Join The Gentry House Team',
    description:
      'Join The Gentry House team and build your barbering career in a premium environment.',
    url: 'https://thegentryhouse.com/careers',
  },
}

const DATE_POSTED = new Date().toISOString().split('T')[0]

export default function CareersPage() {
  const jobPostingsJsonLd = OPEN_ROLES.map((role) => {
    const location = getLocationById(role.locationId)!
    return {
      '@context': 'https://schema.org',
      '@type': 'JobPosting',
      title: `${role.title} — ${location.name}`,
      description: CAREER_POSITION_DESCRIPTIONS[role.title],
      employmentType: 'FULL_TIME',
      datePosted: DATE_POSTED,
      hiringOrganization: {
        '@type': 'Organization',
        name: "The Gentry's House",
        sameAs: 'https://thegentryhouse.com',
      },
      jobLocation: {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: location.address,
          addressLocality: location.city,
          addressRegion: location.region,
          postalCode: location.postalCode,
          addressCountry: 'US',
        },
      },
    }
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingsJsonLd) }}
      />
      <main className="min-h-screen bg-luxury-midnight">
        <CareersHero />
        <CareersWhyTGH />
        <CareersGrowthPath />
        <CareersCulture />
        <CareersPositions />
        <CareersLocations />
        <CareersTestimonials />
        <CareerApplicationForm />
      </main>
    </>
  )
}
