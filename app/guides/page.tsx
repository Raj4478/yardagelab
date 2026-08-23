import Link from 'next/link';
import type { Metadata } from 'next';
import { ContentPage } from '@/components/content/ContentPage';
import { GUIDES } from '@/lib/guides';
import { HUBS } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Fabric, Sewing & Quilting Guides',
  description: 'Evergreen fabric, sewing and quilting references that explain the assumptions behind YardageLab calculators.',
  path: '/guides/',
});

export default function GuidesPage() {
  return (
    <ContentPage
      title="Fabric, sewing & quilting guides"
      intro="Reference material for measurements, yardage, backing and binding — written to support the calculators, not to pad the site with generic articles."
      breadcrumbName="Guides"
      breadcrumbPath="/guides/"
    >
      <div className="not-prose grid gap-4 sm:grid-cols-2">
        {GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}/`} className="card p-5 transition hover:border-teal/40 hover:shadow-lift">
            <p className="font-mono text-xs text-ink-faint">{HUBS[guide.hub].title}</p>
            <h2 className="mt-2 font-display text-xl font-medium text-ink">{guide.title}</h2>
            <p className="mt-2 font-sans text-sm leading-relaxed text-ink-soft">{guide.description}</p>
          </Link>
        ))}
      </div>
    </ContentPage>
  );
}
