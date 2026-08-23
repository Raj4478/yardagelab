import type { Metadata } from 'next';
import { SITE, absoluteUrl, shouldIndex } from './site';

/**
 * SEO metadata + structured-data generators.
 *
 * Only ever emit schema that accurately represents visible page content.
 * No invented ratings, reviews, authorship or pricing.
 */

export interface PageSEOConfig {
  title: string;
  description: string;
  /** Path (e.g. '/quilting/backing-calculator/'). Canonical is derived. */
  path: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  /** Force noindex regardless of environment (e.g. thank-you pages). */
  noindex?: boolean;
}

export function generatePageMetadata(config: PageSEOConfig): Metadata {
  const canonical = absoluteUrl(config.path);
  const index = shouldIndex && !config.noindex;

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    alternates: { canonical },
    robots: {
      index,
      follow: index,
      googleBot: { index, follow: index },
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.locale,
      type: config.ogType ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      site: SITE.twitter,
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webApplicationJsonLd(params: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE.organization, url: SITE.url },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: SITE.locale,
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.organization,
    url: SITE.url,
    description: SITE.description,
  };
}
