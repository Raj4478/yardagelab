import type {
  Assumption,
  BaseResult,
  CalculationWarning,
  Measurement,
  VisualizationData,
} from './types';
import { convert } from '@/lib/units';
import { roundTo, roundUpToIncrement } from '@/lib/rounding';

/**
 * Curtain fabric calculator.
 *
 * Curtains need extra width for gather ("fullness") and extra length for the
 * header (top) and hem (bottom). Fabric comes in a fixed width, so several
 * cut "widths" are seamed side by side to reach the gathered width, then each
 * width is cut to the finished drop plus allowances (rounded up to a full
 * pattern repeat when the fabric has one).
 */

export interface CurtainInput {
  windowWidth: Measurement;
  /** Desired finished curtain drop (top of header to bottom of hem). */
  finishedLength: Measurement;
  /** Gather ratio: 2.0 = double fullness. Default 2.0. */
  fullnessRatio?: number;
  fabricWidth: Measurement;
  /** Total header allowance added to the cut length. */
  headerAllowance: Measurement;
  /** Total hem allowance added to the cut length. */
  hemAllowance: Measurement;
  /** Vertical pattern repeat; cut length rounds up to a multiple. Default 0. */
  patternRepeat?: Measurement;
  /** Number of separate panels (e.g. 2 for a pair). Default 1. */
  panels?: number;
  /** Purchase rounding increment, in yards. Default 0.25 yd. */
  purchaseIncrementYd?: number;
}

export interface CurtainResult extends BaseResult {
  gatheredWidthIn: number;
  fabricWidthsNeeded: number;
  cutLengthIn: number;
  totalFabricLengthIn: number;
  exactYardage: number;
  recommendedPurchaseYardage: number;
  visualizationData: VisualizationData;
}

export function calculateCurtainFabric(input: CurtainInput): CurtainResult {
  const windowWIn = toIn(input.windowWidth);
  const finishedLIn = toIn(input.finishedLength);
  const fabricWidthIn = toIn(input.fabricWidth);
  const headerIn = toIn(input.headerAllowance);
  const hemIn = toIn(input.hemAllowance);
  const repeatIn = input.patternRepeat ? toIn(input.patternRepeat) : 0;
  const fullness = input.fullnessRatio ?? 2.0;
  const panels = Math.max(1, Math.floor(input.panels ?? 1));
  const purchaseIncrementYd = input.purchaseIncrementYd ?? 0.25;

  const warnings: CalculationWarning[] = [];
  if (fullness < 1) {
    warnings.push({
      code: 'fullness_low',
      message: 'A fullness ratio below 1.0 means the curtain is narrower than the window.',
    });
  }

  const gatheredWidthIn = windowWIn * fullness;
  const fabricWidthsNeeded = Math.max(panels, Math.ceil(roundTo(gatheredWidthIn / fabricWidthIn, 6)));

  let cutLengthIn = finishedLIn + headerIn + hemIn;
  if (repeatIn > 0) {
    cutLengthIn = roundUpToIncrement(cutLengthIn, repeatIn);
    warnings.push({
      code: 'pattern_repeat',
      message: `Cut length rounded up to a full ${roundTo(repeatIn, 2)} in pattern repeat so panels match.`,
    });
  }

  const totalFabricLengthIn = fabricWidthsNeeded * cutLengthIn;
  const exactYardage = totalFabricLengthIn / 36;
  const recommendedPurchaseYardage = roundUpToIncrement(exactYardage, purchaseIncrementYd);

  const assumptions: Assumption[] = [
    { label: 'Fullness ratio', value: `${fullness}×` },
    { label: 'Gathered width', value: `${roundTo(gatheredWidthIn, 1)} in` },
    { label: 'Header + hem allowance', value: `${roundTo(headerIn + hemIn, 2)} in` },
    { label: 'Pattern repeat', value: repeatIn > 0 ? `${roundTo(repeatIn, 2)} in` : 'none' },
    { label: 'Fabric widths seamed', value: `${fabricWidthsNeeded}` },
    { label: 'Purchase rounded up to', value: `${purchaseIncrementYd} yd` },
  ];

  return {
    gatheredWidthIn: roundTo(gatheredWidthIn, 2),
    fabricWidthsNeeded,
    cutLengthIn: roundTo(cutLengthIn, 3),
    totalFabricLengthIn: roundTo(totalFabricLengthIn, 3),
    exactYardage: roundTo(exactYardage, 4),
    recommendedPurchaseYardage,
    assumptions,
    warnings,
    visualizationData: buildCurtainVisualization(fabricWidthsNeeded, fabricWidthIn, cutLengthIn),
  };
}

function buildCurtainVisualization(
  widths: number,
  fabricWidthIn: number,
  cutLengthIn: number,
): VisualizationData {
  const rects: VisualizationData['rects'] = [];
  for (let i = 0; i < widths; i++) {
    rects.push({
      x: i * fabricWidthIn,
      y: 0,
      width: fabricWidthIn,
      height: cutLengthIn,
      role: 'panel',
      label: `Width ${i + 1}`,
    });
  }
  return {
    boundingWidth: Math.max(widths * fabricWidthIn, 1),
    boundingHeight: Math.max(cutLengthIn, 1),
    rects,
    caption: `${widths} fabric width${widths === 1 ? '' : 's'} × ${roundTo(cutLengthIn, 1)} in`,
  };
}

function toIn(m: Measurement): number {
  return convert(m.value, m.unit, 'inch');
}
