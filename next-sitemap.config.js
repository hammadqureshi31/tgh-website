/**@type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thegentryhouse.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  exclude: ['/admin', '/api/*', '/dashboard/*'],
  additionalPaths: async (config) => [
    // await config.transform(config, '/barber-lake-saint-louis'),
    // await config.transform(config, '/barber-ofallon-mo'),
    // await config.transform(config, '/barber-wentzville-mo'),
    // await config.transform(config, '/barber-dardenne-prairie-mo'),
    await config.transform(config, '/services'),
    // await config.transform(config, '/book'),
    await config.transform(config, '/faq'),
    await config.transform(config, '/about'),
    await config.transform(config, '/blog'),
    // await config.transform(config, '/products/texture-powder'),
    // await config.transform(config, '/grooming-guide'),
  ],
  robotsTxtOptions: {
    additionalSitemaps: [],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/dashboard/'],
      },
    ],
  },
}