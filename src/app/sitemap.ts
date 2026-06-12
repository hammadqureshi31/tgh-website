import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thegentryhouse.com';
  const lastModified = new Date();

  const routes = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/faq',
    '/blog',
    // '/contact',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: lastModified,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
