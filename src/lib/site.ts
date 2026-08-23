/** Global site configuration and canonical URL helpers. */

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const canonicalSiteUrl = configuredSiteUrl || 'https://yardagelab.com';

export const SITE = {
  name: 'YardageLab',
  tagline: 'Fabric math without the guesswork.',
  description:
    'Free calculators, visual cutting plans and project planning tools for sewing, quilting and fabric projects.',
  /** Canonical production origin. Blank or missing values safely fall back to yardagelab.com. */
  url: canonicalSiteUrl.replace(/\/$/, ''),
  locale: 'en-US',
  twitter: '@yardagelab',
  organization: 'YardageLab',
} as const;

/** Build an absolute, canonical URL for a path (always trailing-slashed). */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const withSlash = clean.endsWith('/') || clean.includes('.') ? clean : `${clean}/`;
  return `${SITE.url}${withSlash}`;
}

export const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

/** Preview / development deployments must never be indexed. */
export const shouldIndex =
  process.env.VERCEL_ENV === 'production' && process.env.NEXT_PUBLIC_ALLOW_INDEX !== 'false';
