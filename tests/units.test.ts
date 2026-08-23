import { describe, it, expect } from 'vitest';
import { convert, toMm, fromMm, MM_PER_UNIT } from '@/lib/units';
import type { LengthUnit } from '@/calculators/types';

describe('unit conversion', () => {
  it('uses exact canonical constants', () => {
    expect(MM_PER_UNIT.inch).toBe(25.4);
    expect(MM_PER_UNIT.yard).toBe(914.4);
    expect(MM_PER_UNIT.foot).toBe(304.8);
  });

  it('converts imperial correctly', () => {
    expect(convert(1, 'yard', 'inch')).toBeCloseTo(36, 9);
    expect(convert(36, 'inch', 'yard')).toBeCloseTo(1, 9);
    expect(convert(1, 'foot', 'inch')).toBeCloseTo(12, 9);
  });

  it('converts metric correctly', () => {
    expect(convert(1, 'meter', 'cm')).toBeCloseTo(100, 9);
    expect(convert(100, 'cm', 'meter')).toBeCloseTo(1, 9);
    expect(convert(1, 'cm', 'mm')).toBeCloseTo(10, 9);
  });

  it('converts across systems', () => {
    expect(convert(1, 'inch', 'cm')).toBeCloseTo(2.54, 9);
    expect(convert(100, 'cm', 'inch')).toBeCloseTo(39.3700787, 6);
    expect(convert(2, 'meter', 'yard')).toBeCloseTo(2.1872266, 6);
  });

  it('is a no-op for identical units', () => {
    expect(convert(7.5, 'inch', 'inch')).toBe(7.5);
  });

  it('round-trips through millimeters for every unit', () => {
    const units: LengthUnit[] = ['inch', 'foot', 'yard', 'mm', 'cm', 'meter'];
    for (const u of units) {
      expect(fromMm(toMm(3.14159, u), u)).toBeCloseTo(3.14159, 9);
    }
  });
});
