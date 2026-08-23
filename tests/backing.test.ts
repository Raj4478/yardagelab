import { describe, it, expect } from 'vitest';
import { calculateQuiltBacking } from '@/calculators/backing';
import type { Measurement } from '@/calculators/types';

const inch = (value: number): Measurement => ({ value, unit: 'inch' });

const base = {
  fabricWidth: inch(42),
  overhangPerSide: inch(4),
  seamAllowance: inch(0.25),
};

describe('calculateQuiltBacking — golden cases', () => {
  it('60x80 quilt on 42in fabric needs two vertical panels, 5 yd', () => {
    const r = calculateQuiltBacking({ ...base, quiltWidth: inch(60), quiltLength: inch(80) });
    expect(r.requiredBackingWidthIn).toBe(68);
    expect(r.requiredBackingLengthIn).toBe(88);
    expect(r.panelCount).toBe(2);
    expect(r.seamOrientation).toBe('vertical');
    expect(r.exactYardage).toBeCloseTo(4.9167, 3);
    expect(r.recommendedPurchaseYardage).toBeCloseTo(5.0, 9);
    expect(r.panelCuts).toHaveLength(2);
  });

  it('small 30x40 quilt fits a single panel with no seam', () => {
    const r = calculateQuiltBacking({ ...base, quiltWidth: inch(30), quiltLength: inch(40) });
    expect(r.panelCount).toBe(1);
    expect(r.exactYardage).toBeCloseTo(48 / 36, 3);
    expect(r.recommendedPurchaseYardage).toBeCloseTo(1.5, 9);
    expect(r.warnings.some((w) => w.code === 'single_width')).toBe(true);
  });

  it('directional fabric forbids rotating panels', () => {
    const nonDir = calculateQuiltBacking({
      ...base,
      quiltWidth: inch(90),
      quiltLength: inch(40),
    });
    const dir = calculateQuiltBacking({
      ...base,
      quiltWidth: inch(90),
      quiltLength: inch(40),
      directionalFabric: true,
    });
    // Rotating helps the wide-short quilt; directional must not rotate.
    expect(dir.seamOrientation).toBe('vertical');
    expect(dir.exactYardage).toBeGreaterThanOrEqual(nonDir.exactYardage);
  });

  it('never recommends less than the exact requirement', () => {
    for (let w = 30; w <= 120; w += 7) {
      for (let l = 30; l <= 120; l += 11) {
        const r = calculateQuiltBacking({ ...base, quiltWidth: inch(w), quiltLength: inch(l) });
        expect(r.recommendedPurchaseYardage).toBeGreaterThanOrEqual(r.exactYardage - 1e-9);
        expect(r.recommendedPurchaseYardage).toBeGreaterThan(0);
        expect(r.panelCount).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('produces visualization geometry that contains the quilt top', () => {
    const r = calculateQuiltBacking({ ...base, quiltWidth: inch(60), quiltLength: inch(80) });
    const quilt = r.visualizationData.rects.find((x) => x.role === 'quilt');
    expect(quilt).toBeDefined();
    expect(quilt!.width).toBe(60);
    expect(quilt!.height).toBe(80);
  });

  it('gives the same answer regardless of input unit', () => {
    const inches = calculateQuiltBacking({ ...base, quiltWidth: inch(60), quiltLength: inch(80) });
    const cm = calculateQuiltBacking({
      quiltWidth: { value: 152.4, unit: 'cm' },
      quiltLength: { value: 203.2, unit: 'cm' },
      fabricWidth: { value: 106.68, unit: 'cm' },
      overhangPerSide: { value: 10.16, unit: 'cm' },
      seamAllowance: { value: 0.635, unit: 'cm' },
    });
    expect(cm.recommendedPurchaseYardage).toBeCloseTo(inches.recommendedPurchaseYardage, 6);
    expect(cm.panelCount).toBe(inches.panelCount);
  });
});
