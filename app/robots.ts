import type { MetadataRoute } from 'next';
import { SITE, shouldIndex } from '@/lib/site';

/**
 * robots.txt is generated intentionally. Preview and development deployments
 * must never be crawlable — only production with indexing enabled opens the
 * site to search engines.
 */
export default function robots(): MetadataRoute.Robots {
  if (!shouldIndex) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
