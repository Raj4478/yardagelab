import { describe, it, expect } from 'vitest';
import { calculateQuiltBinding } from '@/calculators/binding';
import type { Measurement } from '@/calculators/types';

const inch = (value: number): Measurement => ({ value, unit: 'inch' });

describe('calculateQuiltBinding — golden cases', () => {
  it('60x80 quilt: 280in perimeter, 7 strips, 0.5 yd', () => {
    const r = calculateQuiltBinding({
      quiltWidth: inch(60),
      quiltLength: inch(80),
      bindingStripWidth: inch(2.5),
      fabricWidth: inch(42),
      overlapAllowance: inch(10),
    });
    expect(r.perimeterIn).toBe(280);
    expect(r.requiredBindingLengthIn).toBe(290);
    expect(r.stripCount).toBe(7);
    expect(r.exactFabricRequirementYd).toBeCloseTo(17.5 / 36, 4);
    expect(r.recommendedPurchaseYd).toBeCloseTo(0.5, 9);
  });

  it('warns when the overlap allowance looks too small', () => {
    const r = calculateQuiltBinding({
      quiltWidth: inch(40),
      quiltLength: inch(40),
      bindingStripWidth: inch(2.25),
      fabricWidth: inch(42),
      overlapAllowance: inch(2),
    });
    expect(r.warnings.some((w) => w.code === 'overlap_low')).toBe(true);
  });

  it('never rounds the purchase below the exact requirement', () => {
    for (let w = 20; w <= 120; w += 13) {
      const r = calculateQuiltBinding({
        quiltWidth: inch(w),
        quiltLength: inch(w + 10),
        bindingStripWidth: inch(2.5),
        fabricWidth: inch(42),
        overlapAllowance: inch(12),
      });
      expect(r.recommendedPurchaseYd).toBeGreaterThanOrEqual(r.exactFabricRequirementYd - 1e-9);
    }
  });
});
