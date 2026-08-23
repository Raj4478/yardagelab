import { describe, it, expect } from 'vitest';
import { calculateQuiltSize } from '@/calculators/quiltSize';
import type { Measurement } from '@/calculators/types';

const inch = (value: number): Measurement => ({ value, unit: 'inch' });

describe('calculateQuiltSize — golden cases', () => {
  it('12in blocks in a 5x6 grid → 60x72, 30 blocks', () => {
    const r = calculateQuiltSize({
      finishedBlockSize: inch(12),
      blocksAcross: 5,
      blocksDown: 6,
    });
    expect(r.finishedWidthIn).toBe(60);
    expect(r.finishedLengthIn).toBe(72);
    expect(r.totalBlocks).toBe(30);
    expect(r.closestBedSize?.name).toBe('Throw / Lap');
  });

  it('adds sashing between blocks and a border on every side', () => {
    const r = calculateQuiltSize({
      finishedBlockSize: inch(12),
      blocksAcross: 5,
      blocksDown: 6,
      sashingWidth: inch(2),
      borderWidth: inch(4),
    });
    // 5*12 + 4*2 + 2*4 = 76 ; 6*12 + 5*2 + 2*4 = 90
    expect(r.finishedWidthIn).toBe(76);
    expect(r.finishedLengthIn).toBe(90);
  });

  it('warns on an empty grid', () => {
    const r = calculateQuiltSize({ finishedBlockSize: inch(12), blocksAcross: 0, blocksDown: 0 });
    expect(r.warnings.some((w) => w.code === 'grid')).toBe(true);
  });
});
