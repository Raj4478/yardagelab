import type {
  Assumption,
  BaseResult,
  CalculationWarning,
  Measurement,
  VisualizationData,
} from './types';
import { convert } from '@/lib/units';
import { roundTo } from '@/lib/rounding';

/**
 * Quilt size calculator.
 *
 * Given a block size and a grid of blocks (with optional sashing between
 * blocks and optional borders), compute the finished quilt dimensions and
 * suggest a matching standard US bed size.
 */

export interface QuiltSizeInput {
  finishedBlockSize: Measurement;
  blocksAcross: number;
  blocksDown: number;
  /** Finished sashing width between blocks. Default 0 (no sashing). */
  sashingWidth?: Measurement;
  /** Finished border width added to every side. Default 0. */
  borderWidth?: Measurement;
}

export interface BedSizeMatch {
  name: string;
  widthIn: number;
  lengthIn: number;
}

export interface QuiltSizeResult extends BaseResult {
  finishedWidthIn: number;
  finishedLengthIn: number;
  totalBlocks: number;
  closestBedSize: BedSizeMatch | null;
  visualizationData: VisualizationData;
}

/** Common finished US quilt/bed sizes (approximate, drop included). */
export const BED_SIZES: BedSizeMatch[] = [
  { name: 'Baby / Crib', widthIn: 36, lengthIn: 52 },
  { name: 'Throw / Lap', widthIn: 52, lengthIn: 60 },
  { name: 'Twin', widthIn: 70, lengthIn: 90 },
  { name: 'Full / Double', widthIn: 84, lengthIn: 90 },
  { name: 'Queen', widthIn: 90, lengthIn: 100 },
  { name: 'King', widthIn: 108, lengthIn: 100 },
];

export function calculateQuiltSize(input: QuiltSizeInput): QuiltSizeResult {
  const blockIn = toIn(input.finishedBlockSize);
  const across = Math.max(0, Math.floor(input.blocksAcross));
  const down = Math.max(0, Math.floor(input.blocksDown));
  const sashIn = input.sashingWidth ? toIn(input.sashingWidth) : 0;
  const borderIn = input.borderWidth ? toIn(input.borderWidth) : 0;

  const warnings: CalculationWarning[] = [];
  if (across < 1 || down < 1) {
    warnings.push({ code: 'grid', message: 'Enter at least one block across and one block down.' });
  }

  // Sashing sits between blocks only → (n - 1) gaps in each direction.
  const sashAcross = Math.max(0, across - 1) * sashIn;
  const sashDown = Math.max(0, down - 1) * sashIn;

  const finishedWidthIn = across * blockIn + sashAcross + 2 * borderIn;
  const finishedLengthIn = down * blockIn + sashDown + 2 * borderIn;
  const totalBlocks = across * down;

  const closestBedSize = findClosestBedSize(finishedWidthIn, finishedLengthIn);

  const assumptions: Assumption[] = [
    { label: 'Finished block size', value: `${roundTo(blockIn, 2)} in` },
    { label: 'Grid', value: `${across} across × ${down} down` },
    { label: 'Sashing between blocks', value: sashIn > 0 ? `${roundTo(sashIn, 2)} in` : 'none' },
    { label: 'Border each side', value: borderIn > 0 ? `${roundTo(borderIn, 2)} in` : 'none' },
  ];

  return {
    finishedWidthIn: roundTo(finishedWidthIn, 3),
    finishedLengthIn: roundTo(finishedLengthIn, 3),
    totalBlocks,
    closestBedSize,
    assumptions,
    warnings,
    visualizationData: buildQuiltSizeVisualization(
      across,
      down,
      blockIn,
      sashIn,
      borderIn,
      finishedWidthIn,
      finishedLengthIn,
    ),
  };
}

function findClosestBedSize(widthIn: number, lengthIn: number): BedSizeMatch | null {
  if (widthIn <= 0 || lengthIn <= 0) return null;
  let best: BedSizeMatch | null = null;
  let bestDist = Infinity;
  for (const size of BED_SIZES) {
    const d = Math.hypot(size.widthIn - widthIn, size.lengthIn - lengthIn);
    if (d < bestDist) {
      bestDist = d;
      best = size;
    }
  }
  return best;
}

function buildQuiltSizeVisualization(
  across: number,
  down: number,
  blockIn: number,
  sashIn: number,
  borderIn: number,
  totalW: number,
  totalL: number,
): VisualizationData {
  const rects: VisualizationData['rects'] = [];
  rects.push({ x: 0, y: 0, width: totalW, height: totalL, role: 'border', label: 'Border' });

  for (let r = 0; r < down; r++) {
    for (let c = 0; c < across; c++) {
      const x = borderIn + c * (blockIn + sashIn);
      const y = borderIn + r * (blockIn + sashIn);
      rects.push({ x, y, width: blockIn, height: blockIn, role: 'block' });
    }
  }

  return {
    boundingWidth: Math.max(totalW, 1),
    boundingHeight: Math.max(totalL, 1),
    rects,
    caption: `${across} × ${down} = ${across * down} blocks`,
  };
}

function toIn(m: Measurement): number {
  return convert(m.value, m.unit, 'inch');
}
