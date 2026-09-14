import { expect, it } from 'vitest';
import { calculateFabricYardage } from '@/calculators/yardage';
import { calculateQuiltSize } from '@/calculators/quiltSize';
const inch = (value: number) => ({ value, unit: 'inch' as const });
it('keeps large cutting plans bounded without truncating the mathematical requirement', () => {
  const r = calculateFabricYardage({ pieceWidth: inch(10), pieceLength: inch(10), quantity: 100000, fabricWidth: inch(40) });
  expect(r.rows).toBe(25000);
  expect(r.totalFabricLengthIn).toBe(250000);
  expect(r.visualizationData.rects.length).toBeLessThanOrEqual(401);
  expect(r.visualizationData.caption).toContain('first 400');
  const q = calculateQuiltSize({finishedBlockSize:inch(10),blocksAcross:1000,blocksDown:1000});
  expect(q.totalBlocks).toBe(1000000);
  expect(q.visualizationData.rects.length).toBeLessThanOrEqual(401);
});
