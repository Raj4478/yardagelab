'use client';

import { useId } from 'react';
import type { LengthUnit } from '@/calculators/types';
import { UNIT_LABEL } from '@/lib/units';

export function NumberField({ label, value, onChange, unit, hint, error, min = 0, step = 'any' }: { label: string; value: string; onChange: (v: string) => void; unit?: LengthUnit | string; hint?: string; error?: string; min?: number; step?: number | 'any'; }) {
  const id = useId();
  return <div><label htmlFor={id} className="field-label">{label}</label><div className="relative"><input id={id} type="number" inputMode="decimal" className="field-input pr-14" value={value} min={min} step={step} onChange={(e) => onChange(e.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined} />{unit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center font-mono text-sm text-ink-faint">{typeof unit === 'string' && unit in UNIT_LABEL ? UNIT_LABEL[unit as LengthUnit] : unit}</span>}</div>{error ? <p id={`${id}-err`} className="mt-1 font-sans text-xs font-medium text-terracotta-deep">{error}</p> : hint ? <p id={`${id}-hint`} className="mt-1 font-sans text-xs text-ink-faint">{hint}</p> : null}</div>;
}

export function Segmented<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; }) {
  return <div role="radiogroup" aria-label={label}><span className="field-label">{label}</span><div className="inline-flex rounded-full border border-line bg-paper-deep/50 p-1">{options.map((opt) => { const active = opt.value === value; return <button key={opt.value} type="button" role="radio" aria-checked={active} onClick={() => onChange(opt.value)} className={`rounded-full px-4 py-1.5 font-sans text-sm font-medium transition ${active ? 'bg-teal text-paper-card shadow-sm' : 'text-ink-soft hover:text-ink'}`}>{opt.label}</button>; })}</div></div>;
}

export function PresetChips({ label, presets, value, onSelect, unit }: { label: string; presets: number[]; value: string; onSelect: (v: string) => void; unit?: string; }) {
  return <div><span className="field-label">{label}</span><div className="flex flex-wrap gap-2">{presets.map((p) => { const active = String(p) === value; return <button key={p} type="button" onClick={() => onSelect(String(p))} className={`rounded-full border px-3 py-1 font-mono text-sm transition ${active ? 'border-terracotta bg-terracotta/10 text-terracotta-deep' : 'border-line text-ink-soft hover:border-ink/40'}`}>{p}{unit ? ` ${unit}` : ''}</button>; })}</div></div>;
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void; }) {
  const id = useId(); return <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5"><input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-line text-teal focus:ring-teal" /><span className="font-sans text-sm text-ink-soft">{label}</span></label>;
}
