/**
 * Central registry of calculators, hubs and static pages.
 *
 * This is the single source of truth for navigation, category hubs,
 * breadcrumbs, internal linking, the sitemap and structured data. Adding a
 * calculator here wires it into all of those systems.
 */

export type HubId = 'quilting' | 'sewing' | 'home-decor' | 'conversions';

export interface HubMeta {
  id: HubId;
  title: string;
  route: string;
  blurb: string;
}

export interface CalculatorMeta {
  id: string;
  title: string;
  /** Short menu/card label. */
  shortTitle: string;
  hub: HubId;
  route: string;
  /** One-sentence purpose shown under the H1. */
  purpose: string;
  /** SEO meta description. */
  description: string;
  keywords: string[];
  /** Related calculator ids for contextual internal links. */
  related: string[];
  lastReviewed: string;
}

export const HUBS: Record<HubId, HubMeta> = {
  quilting: {
    id: 'quilting',
    title: 'Quilting Calculators',
    route: '/quilting/',
    blurb: 'Plan backing, binding and quilt size before you cut a single square.',
  },
  sewing: {
    id: 'sewing',
    title: 'Sewing Calculators',
    route: '/sewing/',
    blurb: 'Work out fabric yardage for garments, projects and multi-piece cuts.',
  },
  'home-decor': {
    id: 'home-decor',
    title: 'Home Decor Calculators',
    route: '/home-decor/',
    blurb: 'Fabric for curtains, pillows, tablecloths and soft furnishings.',
  },
  conversions: {
    id: 'conversions',
    title: 'Conversions & Reference',
    route: '/conversions/',
    blurb: 'Switch between inches, yards, centimeters and meters with confidence.',
  },
};

export const CALCULATORS: CalculatorMeta[] = [
  {
    id: 'quilt-backing-calculator',
    title: 'Quilt Backing Calculator',
    shortTitle: 'Quilt Backing',
    hub: 'quilting',
    route: '/quilting/backing-calculator/',
    purpose:
      'Work out how much backing fabric to buy, how many panels to cut and which way the seam should run.',
    description:
      'Free quilt backing calculator: enter your quilt size and fabric width to get exact yardage, panel cuts, seam direction and a visual cutting plan.',
    keywords: ['quilt backing calculator', 'quilt backing yardage', 'how much backing fabric'],
    related: ['quilt-binding-calculator', 'quilt-size-calculator', 'fabric-unit-converter'],
    lastReviewed: '2026-08-23',
  },
  {
    id: 'quilt-binding-calculator',
    title: 'Quilt Binding Calculator',
    shortTitle: 'Quilt Binding',
    hub: 'quilting',
    route: '/quilting/binding-calculator/',
    purpose:
      'Find the binding length, number of strips and fabric you need to bind the edge of your quilt.',
    description:
      'Free quilt binding calculator: enter quilt dimensions and strip width to get perimeter, strip count and the exact binding fabric to buy.',
    keywords: ['quilt binding calculator', 'binding fabric calculator', 'how many binding strips'],
    related: ['quilt-backing-calculator', 'quilt-size-calculator', 'fabric-yardage-calculator'],
    lastReviewed: '2026-08-23',
  },
  {
    id: 'quilt-size-calculator',
    title: 'Quilt Size Calculator',
    shortTitle: 'Quilt Size',
    hub: 'quilting',
    route: '/quilting/quilt-size-calculator/',
    purpose:
      'Turn a block size and layout into finished quilt dimensions and the closest standard bed size.',
    description:
      'Free quilt size calculator: enter block size, grid, sashing and borders to get finished quilt dimensions and a matching bed size.',
    keywords: ['quilt size calculator', 'finished quilt size', 'quilt dimensions by blocks'],
    related: ['quilt-backing-calculator', 'quilt-binding-calculator', 'fabric-yardage-calculator'],
    lastReviewed: '2026-08-23',
  },
  {
    id: 'fabric-yardage-calculator',
    title: 'Fabric Yardage Calculator',
    shortTitle: 'Fabric Yardage',
    hub: 'sewing',
    route: '/sewing/fabric-yardage-calculator/',
    purpose:
      'Calculate how much fabric to buy for any number of same-size pieces, laid out to waste as little as possible.',
    description:
      'Free fabric yardage calculator: enter piece size, quantity and fabric width to get the exact yardage and an efficient cutting layout.',
    keywords: ['fabric yardage calculator', 'how much fabric do I need', 'fabric calculator'],
    related: ['fabric-unit-converter', 'quilt-backing-calculator', 'curtain-fabric-calculator'],
    lastReviewed: '2026-08-23',
  },
  {
    id: 'curtain-fabric-calculator',
    title: 'Curtain Fabric Calculator',
    shortTitle: 'Curtain Fabric',
    hub: 'home-decor',
    route: '/home-decor/curtain-fabric-calculator/',
    purpose:
      'Calculate curtain fabric including fullness, header, hem and pattern repeat for a pair of panels.',
    description:
      'Free curtain fabric calculator: enter window size, drop and fullness to get the number of fabric widths and total yardage for your curtains.',
    keywords: ['curtain fabric calculator', 'how much curtain fabric', 'curtain yardage calculator'],
    related: ['fabric-yardage-calculator', 'fabric-unit-converter'],
    lastReviewed: '2026-08-23',
  },
  {
    id: 'fabric-unit-converter',
    title: 'Fabric Unit Converter',
    shortTitle: 'Unit Converter',
    hub: 'conversions',
    route: '/conversions/fabric-unit-converter/',
    purpose:
      'Convert between inches, feet, yards, millimeters, centimeters and meters for fabric and cutting.',
    description:
      'Free fabric unit converter: switch between inches, yards, centimeters and meters with an imperial fraction readout for the cutting table.',
    keywords: ['fabric unit converter', 'inches to yards', 'cm to inches fabric'],
    related: ['fabric-yardage-calculator', 'quilt-backing-calculator'],
    lastReviewed: '2026-08-23',
  },
];

export const CALCULATOR_BY_ID: Record<string, CalculatorMeta> = Object.fromEntries(
  CALCULATORS.map((c) => [c.id, c]),
);

export function calculatorsInHub(hub: HubId): CalculatorMeta[] {
  return CALCULATORS.filter((c) => c.hub === hub);
}

export function relatedCalculators(id: string): CalculatorMeta[] {
  const meta = CALCULATOR_BY_ID[id];
  if (!meta) return [];
  return meta.related.map((r) => CALCULATOR_BY_ID[r]).filter((c): c is CalculatorMeta => Boolean(c));
}

export interface StaticPageMeta {
  route: string;
  title: string;
  description: string;
}

export const STATIC_PAGES: StaticPageMeta[] = [
  { route: '/about/', title: 'About YardageLab', description: 'Who builds YardageLab and why.' },
  { route: '/contact/', title: 'Contact', description: 'Get in touch with the YardageLab team.' },
  {
    route: '/calculation-methodology/',
    title: 'Calculation Methodology',
    description: 'The formulas, assumptions and rounding rules behind every YardageLab calculator.',
  },
  {
    route: '/privacy-policy/',
    title: 'Privacy Policy',
    description: 'How YardageLab handles data and privacy.',
  },
  { route: '/terms/', title: 'Terms of Use', description: 'Terms for using YardageLab.' },
  {
    route: '/cookie-policy/',
    title: 'Cookie Policy',
    description: 'How YardageLab uses cookies and similar technologies.',
  },
  {
    route: '/editorial-policy/',
    title: 'Editorial Policy',
    description: 'How YardageLab researches, reviews and publishes calculators and guides.',
  },
];
