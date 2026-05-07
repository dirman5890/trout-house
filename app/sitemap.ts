import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { ALL_UNIT_NUMBERS_QUERY } from '@/lib/sanity/queries';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, '');
  const now = new Date();

  let unitNumbers: string[] = [];
  try {
    unitNumbers = await sanityClient.fetch<string[]>(ALL_UNIT_NUMBERS_QUERY);
  } catch {
    // Sanity not configured — fall through with empty list.
  }

  const staticRoutes = ['', '/units', '/short-stays', '/neighborhood', '/apply'].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1.0 : 0.8,
  }));

  const unitRoutes = unitNumbers.map((unitNumber) => ({
    url: `${base}/units/${unitNumber}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...unitRoutes];
}
