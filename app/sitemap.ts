import type { MetadataRoute } from 'next';
import { CALCULATORS, HUBS, STATIC_PAGES } from '@/lib/registry';
import { absoluteUrl, shouldIndex } from '@/lib/site';

/**
 * XML sitemap. Contains only canonical, indexable, published URLs. Preview and
 * development builds emit an empty sitemap so nothing leaks into search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!shouldIndex) return [];

  const now = new Date();

  const homepage = {
    url: absoluteUrl('/'),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 1,
  };

  const hubs = Object.values(HUBS).map((hub) => ({
    url: absoluteUrl(hub.route),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const calculators = CALCULATORS.map((c) => ({
    url: absoluteUrl(c.route),
    lastModified: new Date(`${c.lastReviewed}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const staticPages = STATIC_PAGES.map((p) => ({
    url: absoluteUrl(p.route),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  }));

  return [homepage, ...hubs, ...calculators, ...staticPages];
}
