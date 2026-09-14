'use client';

import { useEffect, useRef } from 'react';
import { track } from '@/lib/analytics';
import { Segmented } from './primitives';
import type { WorkingUnit } from './useCalcFields';
import { useCalculatorView } from '@/components/analytics/useCalculatorView';

export function ToolShell({ calculatorId, unit, onUnitChange, form, result, onPrint }: { calculatorId: string; unit: WorkingUnit; onUnitChange: (u: WorkingUnit) => void; form: React.ReactNode; result: React.ReactNode; onPrint?: () => void; }) {
  const root = useRef<HTMLDivElement>(null);
  useCalculatorView(calculatorId);
  const started = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, [calculatorId]);
  function edited() {
    if (!started.current) {
      track({ name: 'calculation_started', params: { calculator_id: calculatorId } });
      started.current = true;
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (root.current?.querySelector('[data-result-ready]')) track({ name: 'calculation_completed', params: { calculator_id: calculatorId, unit_system: unit === 'inch' ? 'imperial' : 'metric' } });
    }, 800);
  }
  return (
    <div ref={root} data-calculator-tool className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-deep/40 px-5 py-3 print:hidden">
        <Segmented<WorkingUnit> label="Units" value={unit} onChange={onUnitChange} options={[{ value: 'inch', label: 'Inches' }, { value: 'cm', label: 'Centimeters' }]} />
        {onPrint && <button type="button" className="btn-ghost" onClick={() => { track({ name: 'print_plan', params: { calculator_id: calculatorId } }); onPrint(); }}><PrinterIcon /> Print plan</button>}
      </div>
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"><div data-calculator-inputs className="min-w-0 space-y-5" onChangeCapture={edited} onClickCapture={event => { if ((event.target as HTMLElement).closest('button')) edited(); }}>{form}</div><div className="min-w-0 lg:border-l lg:border-line lg:pl-8">{result}</div></div>
    </div>
  );
}
function PrinterIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 14h12v7H6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
