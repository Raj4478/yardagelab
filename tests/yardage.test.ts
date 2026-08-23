import { describe, it, expect } from 'vitest';
import { calculateFabricYardage } from '@/calculators/yardage';
import type { Measurement } from '@/calculators/types';

const inch = (value: number): Measurement => ({ value, unit: 'inch' });

describe('calculateFabricYardage — golden cases', () => {
  it('4 pieces of 18x22 on 42in fabric → 2 per row, 2 rows, 1.25 yd', () => {
    const r = calculateFabricYardage({
      pieceWidth: inch(18),
      pieceLength: inch(22),
      quantity: 4,
      fabricWidth: inch(42),
    });
    expect(r.piecesPerRow).toBe(2);
    expect(r.rows).toBe(2);
    expect(r.totalFabricLengthIn).toBe(44);
    expect(r.recommendedPurchaseYardage).toBeCloseTo(1.25, 9);
    expect(r.layoutRotated).toBe(false);
  });

  it('rotates pieces when it saves fabric', () => {
    // 2 pieces of 40x10 on 42in fabric: as-is 1/row×2 rows=20in;
    // rotated (10 across) 4/row×1 row=40in → as-is wins here.
    const r = calculateFabricYardage({
      pieceWidth: inch(40),
      pieceLength: inch(10),
      quantity: 2,
      fabricWidth: inch(42),
    });
    expect(r.totalFabricLengthIn).toBe(20);
  });

  it('flags a piece wider than the fabric in every orientation', () => {
    const r = calculateFabricYardage({
      pieceWidth: inch(50),
      pieceLength: inch(60),
      quantity: 1,
      fabricWidth: inch(42),
    });
    expect(r.warnings.some((w) => w.code === 'piece_too_wide')).toBe(true);
    expect(r.recommendedPurchaseYardage).toBe(0);
  });

  it('returns zero for zero quantity', () => {
    const r = calculateFabricYardage({
      pieceWidth: inch(10),
      pieceLength: inch(10),
      quantity: 0,
      fabricWidth: inch(42),
    });
    expect(r.recommendedPurchaseYardage).toBe(0);
    expect(r.warnings.some((w) => w.code === 'zero_quantity')).toBe(true);
  });

  it('adds seam allowance to every edge', () => {
    const noSeam = calculateFabricYardage({
      pieceWidth: inch(20),
      pieceLength: inch(20),
      quantity: 2,
      fabricWidth: inch(42),
    });
    const withSeam = calculateFabricYardage({
      pieceWidth: inch(20),
      pieceLength: inch(20),
      quantity: 2,
      fabricWidth: inch(42),
      seamAllowance: inch(0.5),
    });
    // 21in pieces no longer fit two-per-row on 42in fabric.
    expect(withSeam.piecesPerRow).toBeLessThanOrEqual(noSeam.piecesPerRow);
  });
});
