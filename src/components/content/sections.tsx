import Link from 'next/link';
import { relatedCalculators } from '@/lib/registry';

export function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {eyebrow && (
        <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-wider text-terracotta">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      <div className="prose-craft mt-4">{children}</div>
    </section>
  );
}

/** Warm, readable long-form typography without the @tailwindcss/typography dep. */
export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-craft">{children}</div>;
}

export interface QA {
  q: string;
  a: React.ReactNode;
}

export function FAQ({ items }: { items: QA[] }) {
  return (
    <div className="divide-y divide-line rounded-xl2 border border-line bg-paper-card">
      {items.map((item, i) => (
        <details key={i} className="group px-5 py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <span className="font-display text-lg font-medium text-ink">{item.q}</span>
            <span
              aria-hidden
              className="shrink-0 text-terracotta transition group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="prose-craft mt-3 text-ink-soft">{item.a}</div>
        </details>
      ))}
    </div>
  );
}

export function RelatedTools({ calculatorId }: { calculatorId: string }) {
  const related = relatedCalculators(calculatorId);
  if (!related.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {related.map((c) => (
        <Link
          key={c.id}
          href={c.route}
          className="group flex items-center justify-between gap-3 rounded-xl2 border border-line bg-paper-card px-5 py-4 shadow-card transition hover:-translate-y-0.5 hover:border-teal/40 hover:shadow-lift"
        >
          <span>
            <span className="block font-display text-lg font-medium text-ink group-hover:text-teal">
              {c.title}
            </span>
            <span className="mt-0.5 block font-sans text-sm text-ink-faint">{c.purpose}</span>
          </span>
          <span aria-hidden className="text-terracotta transition group-hover:translate-x-1">
            →
          </span>
        </Link>
      ))}
    </div>
  );
}

export function LastReviewed({ date }: { date: string }) {
  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <p className="font-sans text-sm text-ink-faint">
      <span className="chip">Last reviewed {formatted}</span>
    </p>
  );
}
