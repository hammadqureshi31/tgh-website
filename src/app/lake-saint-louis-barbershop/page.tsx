import type { Metadata } from "next";
import Script from "next/script";
import MobileBookingButton from "@/components/MobileBookingButton";
import GeoHero from "@/components/geo/lake-saint-louis-barberhsop/GeoHero";
import TrustBar from "@/components/geo/lake-saint-louis-barberhsop/TrustBar";
import TransformationsSection from "@/components/geo/lake-saint-louis-barberhsop/TransformationsSection";
import Services from "@/components/sections/Services";
import WhyTGHSection from "@/components/geo/lake-saint-louis-barberhsop/WhyTGHSection";
import LocalSEOSection from "@/components/geo/lake-saint-louis-barberhsop/LocalSEOSection";
import ExperienceSection from "@/components/geo/lake-saint-louis-barberhsop/ExperienceSection";
import TestimonialsSection from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQ";

export const metadata: Metadata = {
  metadataBase: new URL("https://thegentryhouse.com"),
  title: "Barbershop in Lake Saint Louis, MO | The Gentry House",
  description:
    "Lake Saint Louis' premier men's barbershop. Expert haircuts, precision fades, beard sculpting & luxury hot-towel shaves at 11112 Veterans Memorial Pkwy. Book today.",
  keywords: [
    "barbershop lake saint louis mo",
    "barbershop lake st louis",
    "men's haircut lake saint louis",
    "best barbershop lake saint louis",
    "barber near me lake saint louis",
    "beard trim lake saint louis",
    "fade haircut lake saint louis",
    "hot towel shave lake saint louis",
    "luxury barbershop st charles county",
    "men's grooming lake saint louis",
    "barber lake saint louis veterans memorial",
    "The Gentry House barbershop",
  ],
  authors: [{ name: "The Gentry's House" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thegentryhouse.com/lake-saint-louis-barbershop",
    siteName: "The Gentry's House",
    title: "Barbershop in Lake Saint Louis, MO | The Gentry House",
    description:
      "Lake Saint Louis' premier men's barbershop — expert cuts, luxury shaves & beard sculpting at 11112 Veterans Memorial Pkwy.",
    images: [
      {
        url: "/tgh-logo-compress.png",
        width: 1200,
        height: 630,
        alt: "The Gentry House — Lake Saint Louis Barbershop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barbershop in Lake Saint Louis, MO | The Gentry House",
    description:
      "Lake Saint Louis' premier men's barbershop — expert cuts, luxury shaves & beard sculpting.",
    images: ["/tgh-logo-compress.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://thegentryhouse.com/lake-saint-louis-barbershop",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "@id": "https://thegentryhouse.com",
  name: "The Gentry's House",
  description:
    "Lake Saint Louis' premier men's barbershop offering expert haircuts, precision fades, beard sculpting, and luxury hot-towel shaves.",
  url: "https://thegentryhouse.com/lake-saint-louis-barbershop",
  telephone: "+1 636-265-0109",
  email: "thegentryhousebarbershop@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "11112 Veterans Memorial Pkwy",
    addressLocality: "Lake Saint Louis",
    addressRegion: "MO",
    postalCode: "63367",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 38.7929,
    longitude: -90.7856,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "09:00",
      closes: "21:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "19:00",
    },
  ],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "648",
    bestRating: "5",
  },
  sameAs: [
    "https://www.instagram.com/tghbarbershop/",
    "https://www.facebook.com/TGHbarbershop/",
  ],
  hasMap:
    "https://maps.google.com/?q=11112+Veterans+Memorial+Pkwy+Lake+Saint+Louis+MO+63367",
  areaServed: [
    {
      "@type": "City",
      name: "Lake Saint Louis",
      containedInPlace: { "@type": "State", name: "Missouri" },
    },
    { "@type": "City", name: "O'Fallon" },
    { "@type": "City", name: "Wentzville" },
    { "@type": "City", name: "Cottleville" },
    { "@type": "City", name: "St. Peters" },
  ],
};

const faqs = [
  {
    question: "What is the best barbershop in Lake Saint Louis?",
    answer:
      "The Gentry House at 11112 Veterans Memorial Pkwy, Lake Saint Louis MO 63367 is the top-rated luxury barbershop in the area, offering premium haircuts starting at $40, hot towel shaves, and comprehensive Full Service grooming.",
  },
  {
    question: "How much does a haircut cost at The Gentry House?",
    answer:
      "Haircuts at The Gentry House range from $30 for a Kid's Haircut (under 12) to $45 for a Skin Fade. Our standard premium Haircut is $40, which includes a hair wash and hot towel style with product.",
  },
  {
    question: "Do you offer hot towel shaves?",
    answer:
      "Yes. We offer classic Face Shaves for $35, which include a hot towel, straight razor pass, hot lather, and a soothing cold towel. We also offer Head Shaves for $50 using a traditional straight razor and hot towel.",
  },
  {
    question: "What is included in the Full Service?",
    answer:
      "Our signature Full Service ($70) is a complete 1-hour grooming experience. It includes a precision haircut, beard trim and line up, straight razor finish, hair wash, and premium styling.",
  },
  {
    question: "Does The Gentry House do beard grooming?",
    answer:
      "Absolutely. We offer a Haircut & Beard combo for $60, or a standalone Beard Trim & Line Up with a hot towel and straight razor finish for $20. We also offer Beard Coloring (Black) for $15.",
  },
  {
    question: "What grooming extras do you provide?",
    answer:
      "We offer a variety of grooming extras to complete your look, including Ear and Nose Waxing ($8 each), Eyebrow Shaping ($10), and professional Hair Coloring ($25). A refreshing Hair Wash is also included free with all services.",
  },
  {
    question: "How do I book an appointment at The Gentry House?",
    answer:
      "You can book online instantly via the booking widget on our website. We are open daily, with evening hours available.",
  },
  {
    question: "Where is The Gentry House located?",
    answer:
      "The Gentry House is located at 11112 Veterans Memorial Pkwy, Lake Saint Louis, MO 63367. It serves clients from Lake Saint Louis, O'Fallon, Wentzville, and Dardenne Prairie.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function LakeStLouisBarberPage() {
  return (
    <>
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main>
        <GeoHero />
        <TrustBar />
        <Services />
        <TransformationsSection />
        <WhyTGHSection /> 
        <LocalSEOSection />
        <ExperienceSection />
        <TestimonialsSection /> 
        <CTASection />
        <FAQSection />
      </main>
      <MobileBookingButton />
    </>
  );
}
