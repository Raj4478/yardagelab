import type { LengthUnit, Measurement } from '@/calculators/types';

/**
 * Deterministic unit conversion.
 *
 * All internal maths happens in a single canonical base unit — the
 * millimetre — using exact conversion constants. Never define a conversion
 * constant anywhere else in the codebase; import from here.
 */

/** Millimetres per one of each supported unit. Exact by definition. */
export const MM_PER_UNIT: Record<LengthUnit, number> = {
  mm: 1,
  cm: 10,
  meter: 1000,
  inch: 25.4,
  foot: 304.8,
  yard: 914.4,
};

export const UNIT_LABEL: Record<LengthUnit, string> = {
  mm: 'mm',
  cm: 'cm',
  meter: 'm',
  inch: 'in',
  foot: 'ft',
  yard: 'yd',
};

export const UNIT_NAME: Record<LengthUnit, string> = {
  mm: 'millimeters',
  cm: 'centimeters',
  meter: 'meters',
  inch: 'inches',
  foot: 'feet',
  yard: 'yards',
};

export const IMPERIAL_UNITS: LengthUnit[] = ['inch', 'foot', 'yard'];
export const METRIC_UNITS: LengthUnit[] = ['mm', 'cm', 'meter'];
export const ALL_UNITS: LengthUnit[] = [...IMPERIAL_UNITS, ...METRIC_UNITS];

export function toMm(value: number, unit: LengthUnit): number {
  return value * MM_PER_UNIT[unit];
}

export function fromMm(mm: number, unit: LengthUnit): number {
  return mm / MM_PER_UNIT[unit];
}

/** Convert a raw value between two units. */
export function convert(value: number, fromUnit: LengthUnit, toUnit: LengthUnit): number {
  if (fromUnit === toUnit) return value;
  return fromMm(toMm(value, fromUnit), toUnit);
}

/** Convert a Measurement to millimetres. */
export function measureMm(m: Measurement): number {
  return toMm(m.value, m.unit);
}

/** Convert a Measurement into a target unit, returning a new Measurement. */
export function toUnit(m: Measurement, unit: LengthUnit): Measurement {
  return { value: convert(m.value, m.unit, unit), unit };
}

export function isImperial(unit: LengthUnit): boolean {
  return IMPERIAL_UNITS.includes(unit);
}
