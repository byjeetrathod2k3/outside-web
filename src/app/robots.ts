import { MetadataRoute } from 'next';
import { getSeoConfig } from '@/lib/db';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.outside.in';
  const seoConfig = getSeoConfig();
  const policies = seoConfig?.crawlerPolicies || {
    googlebot: true,
    bingbot: true,
    oaiSearch: true,
    perplexity: true,
    claudeBot: true,
  };

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/*', '/checkout/success'],
    },
    {
      userAgent: 'Googlebot',
      allow: policies.googlebot ? '/' : undefined,
      disallow: policies.googlebot ? ['/api/*'] : '/',
    },
    {
      userAgent: 'Bingbot',
      allow: policies.bingbot ? '/' : undefined,
      disallow: policies.bingbot ? ['/api/*'] : '/',
    },
    {
      userAgent: 'OAI-SearchBot',
      allow: policies.oaiSearch ? '/' : undefined,
      disallow: policies.oaiSearch ? ['/api/*'] : '/',
    },
    {
      userAgent: 'PerplexityBot',
      allow: policies.perplexity ? '/' : undefined,
      disallow: policies.perplexity ? ['/api/*'] : '/',
    },
    {
      userAgent: 'ClaudeBot',
      allow: policies.claudeBot ? '/' : undefined,
      disallow: policies.claudeBot ? ['/api/*'] : '/',
    },
  ];

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
