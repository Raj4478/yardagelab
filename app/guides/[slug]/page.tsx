import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContentPage } from '@/components/content/ContentPage';
import { GUIDE_BY_SLUG, GUIDES } from '@/lib/guides';
import { CALCULATOR_BY_ID } from '@/lib/registry';
import { generatePageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG[slug];
  if (!guide) return {};
  return generatePageMetadata({
    title: guide.title,
    description: guide.description,
    path: `/guides/${guide.slug}/`,
  });
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = GUIDE_BY_SLUG[slug];
  if (!guide) notFound();

  const calculators = guide.relatedCalculatorIds
    .map((id) => CALCULATOR_BY_ID[id])
    .filter(Boolean);

  return (
    <ContentPage
      title={guide.title}
      intro={guide.description}
      breadcrumbName="Guides"
      breadcrumbPath="/guides/"
    >
      {guide.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}

      <aside className="not-prose mt-10 rounded-xl border border-line bg-paper-deep/40 p-5">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-terracotta">Use the calculators</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {calculators.map((calculator) => (
            <Link key={calculator.id} href={calculator.route} className="btn-ghost">
              {calculator.shortTitle} →
            </Link>
          ))}
        </div>
      </aside>

      <p className="mt-8 text-sm text-ink-faint">Last reviewed: {guide.lastReviewed}. Measurements and construction practices vary; verify project-specific requirements before cutting expensive fabric.</p>
    </ContentPage>
  );
}
