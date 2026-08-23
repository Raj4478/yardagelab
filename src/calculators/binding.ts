import type { Assumption, BaseResult, CalculationWarning, Measurement } from './types';
import { convert } from '@/lib/units';
import { roundTo, roundUpToIncrement } from '@/lib/rounding';

/**
 * Quilt binding calculator.
 *
 * Binding is made from strips cut across the width of the fabric (WOF),
 * joined end to end and folded around the quilt's perimeter. We compute the
 * total binding length needed, the number of WOF strips, and the fabric
 * (yardage) that yields those strips.
 */

export interface BindingInput {
  quiltWidth: Measurement;
  quiltLength: Measurement;
  /** Cut width of each binding strip (e.g. 2.5" for double-fold). */
  bindingStripWidth: Measurement;
  /** Usable fabric width (WOF). */
  fabricWidth: Measurement;
  /** Extra length for corners, joins and the closing overlap. */
  overlapAllowance: Measurement;
  /** Purchase rounding increment, in yards. Default 0.125 yd (⅛). */
  purchaseIncrementYd?: number;
}

export interface BindingResult extends BaseResult {
  perimeterIn: number;
  requiredBindingLengthIn: number;
  stripCount: number;
  stripWidthIn: number;
  exactFabricRequirementYd: number;
  recommendedPurchaseYd: number;
}

export function calculateQuiltBinding(input: BindingInput): BindingResult {
  const wIn = toIn(input.quiltWidth);
  const lIn = toIn(input.quiltLength);
  const stripWidthIn = toIn(input.bindingStripWidth);
  const fabricWidthIn = toIn(input.fabricWidth);
  const overlapIn = toIn(input.overlapAllowance);
  const purchaseIncrementYd = input.purchaseIncrementYd ?? 0.125;

  const warnings: CalculationWarning[] = [];

  const perimeterIn = 2 * (wIn + lIn);
  const requiredBindingLengthIn = perimeterIn + overlapIn;

  const stripCount = Math.max(1, Math.ceil(roundTo(requiredBindingLengthIn / fabricWidthIn, 6)));
  // Each strip consumes `stripWidthIn` of fabric length off the bolt.
  const fabricLengthIn = stripCount * stripWidthIn;
  const exactFabricRequirementYd = fabricLengthIn / 36;
  const recommendedPurchaseYd = roundUpToIncrement(exactFabricRequirementYd, purchaseIncrementYd);

  if (stripWidthIn <= 0) {
    warnings.push({ code: 'strip_width', message: 'Binding strip width must be greater than zero.' });
  }
  if (overlapIn < 8) {
    warnings.push({
      code: 'overlap_low',
      message: 'A total corner + join + overlap allowance of about 10–15 inches is typical.',
    });
  }

  const assumptions: Assumption[] = [
    { label: 'Perimeter', value: `${roundTo(perimeterIn, 2)} in` },
    { label: 'Corner + join + overlap allowance', value: `${roundTo(overlapIn, 2)} in` },
    { label: 'Binding strip cut width', value: `${roundTo(stripWidthIn, 3)} in` },
    { label: 'Usable fabric width', value: `${roundTo(fabricWidthIn, 2)} in` },
    { label: 'Strips cut across the fabric (WOF)', value: `${stripCount}` },
    { label: 'Purchase rounded up to', value: `${purchaseIncrementYd} yd` },
  ];

  return {
    perimeterIn: roundTo(perimeterIn, 3),
    requiredBindingLengthIn: roundTo(requiredBindingLengthIn, 3),
    stripCount,
    stripWidthIn: roundTo(stripWidthIn, 3),
    exactFabricRequirementYd: roundTo(exactFabricRequirementYd, 4),
    recommendedPurchaseYd,
    assumptions,
    warnings,
  };
}

function toIn(m: Measurement): number {
  return convert(m.value, m.unit, 'inch');
}
