'use client';
import { forwardRef } from 'react';
import { ResultActions } from './ResultActions';
export function EmptyResult({ message }: { message: string }) { return <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl2 border border-dashed border-line bg-paper-deep/30 p-8 text-center"><RulerIcon /><p className="mt-3 max-w-xs font-sans text-sm text-ink-faint">{message}</p></div>; }
export const ResultReadyRegion = forwardRef<HTMLDivElement, { calcId: string; unit: string; children: React.ReactNode }>(function ResultReadyRegion({ calcId, children }, ref) {
  return <div ref={ref} data-result-ready className="animate-rise"><ResultActions calculatorId={calcId}><div aria-live="polite">{children}</div></ResultActions></div>;
});
function RulerIcon() { return <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden className="text-line"><rect x="6" y="16" width="36" height="16" rx="2" stroke="currentColor" strokeWidth="2" />{[12,18,24,30,36].map((x,i)=><line key={x} x1={x} y1="16" x2={x} y2={i%2===0?24:21} stroke="currentColor" strokeWidth="1.6" />)}</svg>; }
