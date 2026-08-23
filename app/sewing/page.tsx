import type { Metadata } from 'next';
import { HubPage } from '@/components/content/HubPage';
import { HUBS } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Sewing Calculators',
  description:
    'Free sewing calculators to work out fabric yardage for garments and projects, with efficient cutting layouts.',
  path: HUBS.sewing.route,
});

export default function Page() {
  return <HubPage hubId="sewing" />;
}
