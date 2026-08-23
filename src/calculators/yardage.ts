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
 * General fabric yardage calculator.
 *
 * "I need N pieces of a given width × length — how much fabric do I buy?"
 * Pieces are laid out in rows across the fabric width. We test both piece
 * orientations (as-is and rotated) and pick the layout that uses the least
 * fabric length, unless the fabric is directional.
 */

export interface YardageInput {
  pieceWidth: Measurement;
  pieceLength: Measurement;
  quantity: number;
  fabricWidth: Measurement;
  /** Seam allowance added to every edge of every piece. Default 0. */
  seamAllowance?: Measurement;
  directionalFabric?: boolean;
  /** Purchase rounding increment, in yards. Default 0.25 yd. */
  purchaseIncrementYd?: number;
}

export interface YardageResult extends BaseResult {
  piecesPerRow: number;
  rows: number;
  totalFabricLengthIn: number;
  exactYardage: number;
  recommendedPurchaseYardage: number;
  layoutRotated: boolean;
  visualizationData: VisualizationData;
}

interface Layout {
  rotated: boolean;
  piecesPerRow: number;
  rows: number;
  totalLengthIn: number;
  pieceAcrossIn: number;
  pieceAlongIn: number;
}

function planLayout(
  acrossIn: number,
  alongIn: number,
  fabricWidthIn: number,
  quantity: number,
  rotated: boolean,
): Layout | null {
  const piecesPerRow = Math.floor(roundTo(fabricWidthIn / acrossIn, 6));
  if (piecesPerRow < 1) return null; // piece too wide for this orientation
  const rows = Math.ceil(quantity / piecesPerRow);
  return {
    rotated,
    piecesPerRow,
    rows,
    totalLengthIn: rows * alongIn,
    pieceAcrossIn: acrossIn,
    pieceAlongIn: alongIn,
  };
}

export function calculateFabricYardage(input: YardageInput): YardageResult {
  const seamIn = input.seamAllowance ? toIn(input.seamAllowance) : 0;
  const pieceWIn = toIn(input.pieceWidth) + 2 * seamIn;
  const pieceLIn = toIn(input.pieceLength) + 2 * seamIn;
  const fabricWidthIn = toIn(input.fabricWidth);
  const quantity = Math.max(0, Math.floor(input.quantity));
  const purchaseIncrementYd = input.purchaseIncrementYd ?? 0.25;
  const directional = input.directionalFabric ?? false;

  const warnings: CalculationWarning[] = [];

  const layouts: Layout[] = [];
  const asIs = planLayout(pieceWIn, pieceLIn, fabricWidthIn, quantity, false);
  if (asIs) layouts.push(asIs);
  if (!directional) {
    const rotated = planLayout(pieceLIn, pieceWIn, fabricWidthIn, quantity, true);
    if (rotated) layouts.push(rotated);
  }

  if (quantity === 0) {
    warnings.push({ code: 'zero_quantity', message: 'Quantity is zero — no fabric needed.' });
  }

  if (layouts.length === 0) {
    warnings.push({
      code: 'piece_too_wide',
      message:
        'The piece is wider than the fabric in every orientation. It must be pieced or a wider fabric used.',
    });
    return emptyResult(warnings, fabricWidthIn, seamIn, purchaseIncrementYd);
  }

  const best = layouts.reduce((a, b) => (b.totalLengthIn < a.totalLengthIn ? b : a));
  const totalFabricLengthIn = quantity === 0 ? 0 : best.totalLengthIn;
  const exactYardage = totalFabricLengthIn / 36;
  const recommendedPurchaseYardage =
    quantity === 0 ? 0 : roundUpToIncrement(exactYardage, purchaseIncrementYd);

  const assumptions: Assumption[] = [
    { label: 'Usable fabric width', value: `${roundTo(fabricWidthIn, 2)} in` },
    { label: 'Seam allowance per edge', value: `${roundTo(seamIn, 3)} in` },
    { label: 'Pieces per fabric width', value: `${best.piecesPerRow}` },
    { label: 'Layout', value: best.rotated ? 'pieces rotated 90°' : 'pieces as entered' },
    { label: 'Purchase rounded up to', value: `${purchaseIncrementYd} yd` },
  ];

  return {
    piecesPerRow: best.piecesPerRow,
    rows: quantity === 0 ? 0 : best.rows,
    totalFabricLengthIn: roundTo(totalFabricLengthIn, 3),
    exactYardage: roundTo(exactYardage, 4),
    recommendedPurchaseYardage,
    layoutRotated: best.rotated,
    assumptions,
    warnings,
    visualizationData: buildYardageVisualization(best, fabricWidthIn, quantity),
  };
}

function buildYardageVisualization(
  layout: Layout,
  fabricWidthIn: number,
  quantity: number,
): VisualizationData {
  const rects: VisualizationData['rects'] = [];
  const totalLen = quantity === 0 ? layout.pieceAlongIn : layout.rows * layout.pieceAlongIn;
  rects.push({ x: 0, y: 0, width: fabricWidthIn, height: totalLen, role: 'fabric', label: 'Fabric' });

  let placed = 0;
  for (let r = 0; r < layout.rows && placed < quantity; r++) {
    for (let c = 0; c < layout.piecesPerRow && placed < quantity; c++) {
      rects.push({
        x: c * layout.pieceAcrossIn,
        y: r * layout.pieceAlongIn,
        width: layout.pieceAcrossIn,
        height: layout.pieceAlongIn,
        role: 'piece',
      });
      placed++;
    }
  }

  return {
    boundingWidth: fabricWidthIn,
    boundingHeight: Math.max(totalLen, layout.pieceAlongIn),
    rects,
    caption: `${quantity} pieces, ${layout.piecesPerRow} per row × ${layout.rows} row${layout.rows === 1 ? '' : 's'}`,
  };
}

function emptyResult(
  warnings: CalculationWarning[],
  fabricWidthIn: number,
  seamIn: number,
  purchaseIncrementYd: number,
): YardageResult {
  return {
    piecesPerRow: 0,
    rows: 0,
    totalFabricLengthIn: 0,
    exactYardage: 0,
    recommendedPurchaseYardage: 0,
    layoutRotated: false,
    assumptions: [
      { label: 'Usable fabric width', value: `${roundTo(fabricWidthIn, 2)} in` },
      { label: 'Seam allowance per edge', value: `${roundTo(seamIn, 3)} in` },
      { label: 'Purchase rounded up to', value: `${purchaseIncrementYd} yd` },
    ],
    warnings,
    visualizationData: { boundingWidth: 1, boundingHeight: 1, rects: [], caption: 'No layout possible' },
  };
}

function toIn(m: Measurement): number {
  return convert(m.value, m.unit, 'inch');
}
