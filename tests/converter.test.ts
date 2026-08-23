import { describe, it, expect } from 'vitest';
import { convertFabricUnits } from '@/calculators/converter';

describe('convertFabricUnits', () => {
  it('converts yards to inches', () => {
    const r = convertFabricUnits({ value: 1, fromUnit: 'yard', toUnit: 'inch' });
    expect(r.value).toBeCloseTo(36, 9);
    expect(r.formattedValue).toBe('36 in');
  });

  it('offers a shop-friendly fraction for imperial targets', () => {
    const r = convertFabricUnits({ value: 60, fromUnit: 'cm', toUnit: 'inch' });
    expect(r.value).toBeCloseTo(23.622, 3);
    expect(r.fractionValue).toBe('23 5/8 in');
  });

  it('returns no fraction for metric targets', () => {
    const r = convertFabricUnits({ value: 1, fromUnit: 'inch', toUnit: 'cm' });
    expect(r.value).toBeCloseTo(2.54, 9);
    expect(r.fractionValue).toBeNull();
  });
});
