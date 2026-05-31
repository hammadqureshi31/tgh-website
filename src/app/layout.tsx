import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/playfair-display/500.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/700-italic.css'
import '@fontsource/playfair-display/800.css'
import '@fontsource/outfit/300.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://thegentlemenshouse.com'),
  title: 'The Gentlemen\'s House | Premium Grooming Experience',
  description:
    'Premium men\'s grooming experience combining expert barbering, luxury service, and modern style. TGH — where modern gentlemen refine their image.',
  keywords: [
    'luxury barbershop',
    'premium grooming',
    'men\'s grooming',
    'luxury haircut',
    'beard sculpting',
    'executive grooming',
    'TGH',
    'The Gentlemen\'s House',
  ],
  authors: [{ name: 'The Gentlemen\'s House' }],
  creator: 'The Gentlemen\'s House',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thegentlemenshouse.com',
    siteName: 'The Gentlemen\'s House',
    title: 'The Gentlemen\'s House | Premium Grooming Experience',
    description:
      'Premium men\'s grooming experience combining expert barbering, luxury service, and modern style.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Gentlemen\'s House — Premium Men\'s Grooming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Gentlemen\'s House | Premium Grooming Experience',
    description:
      'Premium men\'s grooming experience combining expert barbering, luxury service, and modern style.',
    images: ['/og-image.jpg'],
    creator: '@tghofficial',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://thegentlemenshouse.com',
  name: 'The Gentlemen\'s House',
  description:
    'Premium men\'s grooming experience combining expert barbering, luxury service, and modern style.',
  url: 'https://thegentlemenshouse.com',
  telephone: '+1-555-TGH-BOOK',
  email: 'hello@thegentlemenshouse.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '120 Fifth Avenue',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10011',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.7128,
    longitude: -74.006,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '10:00',
      closes: '16:00',
    },
  ],
  priceRange: '$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '648',
  },
  sameAs: [
    'https://instagram.com/thegentlemenshouse',
    'https://twitter.com/tghofficial',
    'https://facebook.com/thegentlemenshouse',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="text/javascript"
          src="https://booksy.com/widget/code.js?id=1747720&country=us&lang=en-US"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
