import type { MetadataRoute } from 'next';
import { CALCULATORS, HUBS, STATIC_PAGES } from '@/lib/registry';
import { GUIDES } from '@/lib/guides';
import { absoluteUrl, shouldIndex } from '@/lib/site';

/**
 * XML sitemap. Contains only canonical, indexable, published URLs. Preview and
 * development builds emit an empty sitemap so nothing leaks into search.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!shouldIndex) return [];

  const homepage = {
    url: absoluteUrl('/'),
    lastModified: new Date('2026-08-23T00:00:00Z'),
    changeFrequency: 'weekly' as const,
    priority: 1,
  };

  const hubs = Object.values(HUBS).map((hub) => ({
    url: absoluteUrl(hub.route),
    lastModified: new Date('2026-08-23T00:00:00Z'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const calculators = CALCULATORS.map((calculator) => ({
    url: absoluteUrl(calculator.route),
    lastModified: new Date(`${calculator.lastReviewed}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  const guides = GUIDES.map((guide) => ({
    url: absoluteUrl(`/guides/${guide.slug}/`),
    lastModified: new Date(`${guide.lastReviewed}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }));

  const staticPages = [
    { route: '/guides/', lastReviewed: '2026-08-23' },
    ...STATIC_PAGES.map((page) => ({ route: page.route, lastReviewed: '2026-08-23' })),
  ].map((page) => ({
    url: absoluteUrl(page.route),
    lastModified: new Date(`${page.lastReviewed}T00:00:00Z`),
    changeFrequency: 'yearly' as const,
    priority: page.route === '/guides/' ? 0.6 : 0.3,
  }));

  return [homepage, ...hubs, ...calculators, ...guides, ...staticPages];
}
