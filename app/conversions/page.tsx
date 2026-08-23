import type { Metadata } from 'next';
import { HubPage } from '@/components/content/HubPage';
import { HUBS } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Fabric Conversion Tools',
  description: 'Free fabric measurement conversion tools for inches, yards, centimeters, meters and more.',
  path: HUBS.conversions.route,
});

export default function Page() {
  return <HubPage hubId="conversions" />;
}
