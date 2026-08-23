'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics';
import { Segmented } from './primitives';
import type { WorkingUnit } from './useCalcFields';

export function ToolShell({ calculatorId, unit, onUnitChange, form, result, onPrint }: { calculatorId: string; unit: WorkingUnit; onUnitChange: (u: WorkingUnit) => void; form: React.ReactNode; result: React.ReactNode; onPrint?: () => void; }) {
  useEffect(() => { track({ name: 'calculator_view', params: { calculator_id: calculatorId } }); }, [calculatorId]);
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-paper-deep/40 px-5 py-3 print:hidden">
        <Segmented<WorkingUnit> label="Units" value={unit} onChange={onUnitChange} options={[{ value: 'inch', label: 'Inches' }, { value: 'cm', label: 'Centimeters' }]} />
        {onPrint && <button type="button" className="btn-ghost" onClick={onPrint}><PrinterIcon /> Print plan</button>}
      </div>
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"><div className="space-y-5">{form}</div><div className="lg:border-l lg:border-line lg:pl-8">{result}</div></div>
    </div>
  );
}
function PrinterIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5a1 1 0 0 1-1 1h-2M6 14h12v7H6z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
