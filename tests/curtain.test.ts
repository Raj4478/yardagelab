import { describe, it, expect } from 'vitest';
import { calculateCurtainFabric } from '@/calculators/curtain';
import type { Measurement } from '@/calculators/types';

const inch = (value: number): Measurement => ({ value, unit: 'inch' });

const base = {
  fabricWidth: inch(54),
  headerAllowance: inch(8),
  hemAllowance: inch(8),
};

describe('calculateCurtainFabric — golden cases', () => {
  it('48in window, 84in drop, 2x fullness → 2 widths, 5.75 yd', () => {
    const r = calculateCurtainFabric({
      ...base,
      windowWidth: inch(48),
      finishedLength: inch(84),
      fullnessRatio: 2,
      panels: 2,
    });
    expect(r.gatheredWidthIn).toBe(96);
    expect(r.fabricWidthsNeeded).toBe(2);
    expect(r.cutLengthIn).toBe(100);
    expect(r.recommendedPurchaseYardage).toBeCloseTo(5.75, 9);
  });

  it('rounds the cut length up to a full pattern repeat', () => {
    const r = calculateCurtainFabric({
      ...base,
      windowWidth: inch(48),
      finishedLength: inch(84),
      fullnessRatio: 2,
      panels: 2,
      patternRepeat: inch(24),
    });
    // 100in cut rounds up to 120in (5 repeats of 24)
    expect(r.cutLengthIn).toBe(120);
    expect(r.recommendedPurchaseYardage).toBeCloseTo(6.75, 9);
    expect(r.warnings.some((w) => w.code === 'pattern_repeat')).toBe(true);
  });

  it('never buys less than the exact requirement', () => {
    const r = calculateCurtainFabric({
      ...base,
      windowWidth: inch(72),
      finishedLength: inch(90),
      fullnessRatio: 2.5,
    });
    expect(r.recommendedPurchaseYardage).toBeGreaterThanOrEqual(r.exactYardage - 1e-9);
  });
});
