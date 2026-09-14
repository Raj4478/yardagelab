'use client';

import { track } from '@/lib/analytics';

export function ChartDownload() {
  return <aside className="not-prose my-8 rounded-xl2 border border-teal/25 bg-teal/5 p-6 print:hidden" aria-label="Free quilt size chart">
    <p className="text-xs font-semibold uppercase tracking-widest text-teal">The cutting-table companion</p>
    <h2 className="mt-2 text-2xl text-ink">Keep a beautiful reference close.</h2>
    <p className="my-3 text-ink-soft">A two-page quilt size chart and project planner, ready to print. Free, with no signup.</p>
    <a className="btn-primary" href="/downloads/yardagelab-quilt-size-chart.pdf" download onClick={() => track({ name: 'download_chart', params: { chart_id: 'quilt-size-chart' } })}>Download free quilt size chart (PDF)</a>
  </aside>;
}
