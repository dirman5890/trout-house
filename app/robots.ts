import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, '');
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // Don't index the embedded Studio — it's an editor, not content.
      { userAgent: '*', disallow: '/studio' },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
