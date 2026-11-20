import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.outside.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/admin/*'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
