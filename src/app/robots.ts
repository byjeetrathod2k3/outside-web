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

  const disallowedAdminPaths = [
    '/api/*',
    '/checkout/success',
    '/admin*',
    '/sys-admin-gate*',
    '/portal-auth-9x2k*',
    '/outside-studio-ops*',
  ];

  const rules: MetadataRoute.Robots['rules'] = [
    {
      userAgent: '*',
      allow: '/',
      disallow: disallowedAdminPaths,
    },
    {
      userAgent: 'Googlebot',
      allow: policies.googlebot ? '/' : undefined,
      disallow: policies.googlebot ? disallowedAdminPaths : '/',
    },
    {
      userAgent: 'Bingbot',
      allow: policies.bingbot ? '/' : undefined,
      disallow: policies.bingbot ? disallowedAdminPaths : '/',
    },
    {
      userAgent: 'OAI-SearchBot',
      allow: policies.oaiSearch ? '/' : undefined,
      disallow: policies.oaiSearch ? disallowedAdminPaths : '/',
    },
    {
      userAgent: 'PerplexityBot',
      allow: policies.perplexity ? '/' : undefined,
      disallow: policies.perplexity ? disallowedAdminPaths : '/',
    },
    {
      userAgent: 'ClaudeBot',
      allow: policies.claudeBot ? '/' : undefined,
      disallow: policies.claudeBot ? disallowedAdminPaths : '/',
    },
  ];

  return {
    rules,
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
