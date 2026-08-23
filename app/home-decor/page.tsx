import type { Metadata } from 'next';
import { HubPage } from '@/components/content/HubPage';
import { HUBS } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Home Decor Fabric Calculators',
  description: 'Free fabric calculators for curtains and home decor projects.',
  path: HUBS['home-decor'].route,
});

export default function Page() {
  return <HubPage hubId="home-decor" />;
}
