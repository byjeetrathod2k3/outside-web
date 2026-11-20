import { MetadataRoute } from 'next';
import { getLocalStore } from '@/lib/db';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.outside.in';
  const store = getLocalStore();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/vault`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/size-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/shipping-returns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/gst-compliance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic Vault Routes
  const vaultRoutes: MetadataRoute.Sitemap = (store.drops || []).map((drop: any) => ({
    url: `${baseUrl}/vault/${drop.slug}`,
    lastModified: new Date(drop.updatedAt || drop.createdAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic Journal Routes
  const journalRoutes: MetadataRoute.Sitemap = (store.journal || []).map((post: any) => ({
    url: `${baseUrl}/journal/${post.slug}`,
    lastModified: new Date(post.publishedAt || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...vaultRoutes, ...journalRoutes];
}
