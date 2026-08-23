import { describe, it, expect } from 'vitest';
import { roundUpToIncrement, roundTo, formatNumber, formatFraction } from '@/lib/rounding';

describe('roundUpToIncrement', () => {
  it('rounds material requirements UP, never down', () => {
    expect(roundUpToIncrement(4.9167, 0.25)).toBeCloseTo(5.0, 9);
    expect(roundUpToIncrement(5.01, 0.25)).toBeCloseTo(5.25, 9);
    expect(roundUpToIncrement(0.4861, 0.125)).toBeCloseTo(0.5, 9);
  });

  it('leaves exact multiples unchanged (float-noise safe)', () => {
    expect(roundUpToIncrement(5.0, 0.25)).toBeCloseTo(5.0, 9);
    expect(roundUpToIncrement(1.5, 0.25)).toBeCloseTo(1.5, 9);
    // 0.1 + 0.2 style noise must not bump to the next increment
    expect(roundUpToIncrement(0.75, 0.25)).toBeCloseTo(0.75, 9);
  });

  it('returns the value when increment is non-positive', () => {
    expect(roundUpToIncrement(3.3, 0)).toBe(3.3);
  });
});

describe('roundTo', () => {
  it('rounds to fixed decimals', () => {
    expect(roundTo(4.916666, 4)).toBe(4.9167);
    expect(roundTo(2.5, 0)).toBe(3);
  });
});

describe('formatNumber', () => {
  it('trims trailing zeros', () => {
    expect(formatNumber(1.25, 2)).toBe('1.25');
    expect(formatNumber(3.0, 2)).toBe('3');
    expect(formatNumber(3.5, 2)).toBe('3.5');
  });
});

describe('formatFraction', () => {
  it('formats mixed fractions to the nearest eighth', () => {
    expect(formatFraction(2.375)).toBe('2 3/8');
    expect(formatFraction(0.5)).toBe('1/2');
    expect(formatFraction(0.125)).toBe('1/8');
    expect(formatFraction(3.0)).toBe('3');
    expect(formatFraction(1.75)).toBe('1 3/4');
  });

  it('reduces fractions', () => {
    expect(formatFraction(0.25)).toBe('1/4');
    expect(formatFraction(0.75)).toBe('3/4');
  });
});
