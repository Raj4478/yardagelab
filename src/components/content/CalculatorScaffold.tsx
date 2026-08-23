import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { StructuredData } from '@/components/seo/StructuredData';
import { HUBS, CALCULATOR_BY_ID } from '@/lib/registry';
import { webApplicationJsonLd } from '@/lib/seo';
import { LastReviewed, RelatedTools, Section } from './sections';

/**
 * Renders a calculator page in the exact order the blueprint specifies:
 * breadcrumb → h1 → purpose → calculator → methodology/example/reference/faq
 * → related tools → sources → last reviewed.
 */
export function CalculatorScaffold({
  calculatorId,
  interactive,
  children,
}: {
  calculatorId: string;
  interactive: React.ReactNode;
  /** Content sections (methodology, worked example, reference, faq, sources). */
  children: React.ReactNode;
}) {
  const meta = CALCULATOR_BY_ID[calculatorId];
  if (!meta) throw new Error(`Unknown calculator: ${calculatorId}`);
  const hub = HUBS[meta.hub];

  return (
    <article className="pb-8">
      <StructuredData
        data={webApplicationJsonLd({
          name: meta.title,
          description: meta.description,
          path: meta.route,
        })}
      />

      {/* Hero */}
      <header className="border-b border-line bg-paper-deep/30">
        <div className="container-wide py-8">
          <Breadcrumb
            items={[
              { name: 'Home', path: '/' },
              { name: hub.title.replace(' Calculators', ''), path: hub.route },
              { name: meta.shortTitle, path: meta.route },
            ]}
          />
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {meta.title}
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-lg text-ink-soft">{meta.purpose}</p>
        </div>
      </header>

      {/* Interactive calculator */}
      <div className="container-wide py-8">{interactive}</div>

      {/* Long-form content */}
      <div className="container-prose space-y-14 py-4">
        {children}

        <Section title="Related calculators" eyebrow="Keep planning">
          <RelatedTools calculatorId={calculatorId} />
        </Section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <LastReviewed date={meta.lastReviewed} />
          <p className="font-sans text-sm text-ink-faint">
            Found an error?{' '}
            <a href="/contact/" className="link-underline">
              Tell us
            </a>{' '}
            — every formula is human-reviewed.
          </p>
        </div>
      </div>
    </article>
  );
}
