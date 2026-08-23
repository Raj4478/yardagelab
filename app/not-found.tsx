import Link from 'next/link';
import type { Metadata } from 'next';
import { CALCULATORS } from '@/lib/registry';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <div className="container-prose py-24 text-center">
      <p className="font-mono text-sm font-semibold uppercase tracking-widest text-terracotta">404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">This page didn’t make the cut.</h1>
      <p className="mx-auto mt-4 max-w-md font-sans text-lg text-ink-soft">The page you’re looking for isn’t here — but your next calculation is one click away.</p>
      <div className="mt-8 flex justify-center"><Link href="/" className="btn-primary">Back to home</Link></div>
      <div className="mt-12"><p className="font-sans text-sm font-semibold uppercase tracking-wide text-ink-faint">Popular calculators</p><div className="mt-4 flex flex-wrap justify-center gap-2">{CALCULATORS.map((c) => <Link key={c.id} href={c.route} className="rounded-full border border-line px-4 py-2 font-sans text-sm text-ink-soft transition hover:border-teal/50 hover:text-teal">{c.shortTitle}</Link>)}</div></div>
    </div>
  );
}
