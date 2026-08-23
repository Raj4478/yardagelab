import type { Metadata } from 'next';
import { HubPage } from '@/components/content/HubPage';
import { HUBS } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Quilting Calculators',
  description: 'Free quilting calculators for backing, binding, quilt sizes and fabric planning.',
  path: HUBS.quilting.route,
});

export default function Page() {
  return <HubPage hubId="quilting" />;
}
