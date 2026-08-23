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
 * Quilt backing calculator.
 *
 * A quilt back must be larger than the quilt top on every side to allow for
 * long-arm loading and quilting take-up. Because quilting fabric is sold in
 * fixed widths (commonly 42–44" of usable width), the back is pieced from
 * one or more full-width panels seamed together.
 *
 * We compute the fabric needed for BOTH seam orientations and choose the one
 * that uses the least fabric. All maths runs in inches internally.
 */

export interface BackingInput {
  quiltWidth: Measurement;
  quiltLength: Measurement;
  /** Usable fabric width (selvedge-to-selvedge, minus unusable edges). */
  fabricWidth: Measurement;
  /** Extra fabric added to EACH side of the quilt. */
  overhangPerSide: Measurement;
  /** Seam allowance added to each panel so panels can be joined. */
  seamAllowance: Measurement;
  /** Directional/one-way print — prevents rotating panels to save fabric. */
  directionalFabric?: boolean;
  /** Purchase rounding increment, in yards. Default 0.25 yd. */
  purchaseIncrementYd?: number;
}

export type SeamOrientation = 'horizontal' | 'vertical';

export interface PanelCut {
  index: number;
  /** Cut width across the fabric, in inches (a full fabric width). */
  cutWidthIn: number;
  /** Cut length along the fabric, in inches. */
  cutLengthIn: number;
}

export interface BackingResult extends BaseResult {
  requiredBackingWidthIn: number;
  requiredBackingLengthIn: number;
  fabricWidthIn: number;
  panelCount: number;
  seamOrientation: SeamOrientation;
  /** Exact fabric length required, in yards (unrounded). */
  exactYardage: number;
  /** Conservative purchase quantity, in yards. */
  recommendedPurchaseYardage: number;
  panelCuts: PanelCut[];
  visualizationData: VisualizationData;
}

interface OrientationPlan {
  orientation: SeamOrientation;
  panelCount: number;
  /** Total fabric length pulled off the bolt, in inches. */
  totalFabricLengthIn: number;
  cutLengthIn: number;
}

function planOrientation(
  orientation: SeamOrientation,
  across: number,
  along: number,
  fabricWidthIn: number,
  seamAllowanceIn: number,
): OrientationPlan {
  // Panels are cut the full usable width of the fabric and seamed side by
  // side to span `across`. Each panel's cut length covers `along` plus a
  // seam allowance at each join.
  const panelCount = Math.max(1, Math.ceil(roundTo(across / fabricWidthIn, 6)));
  const seamsPerPanel = panelCount > 1 ? 2 : 0; // both cut ends available to seam
  const cutLengthIn = along + seamsPerPanel * seamAllowanceIn;
  const totalFabricLengthIn = panelCount * cutLengthIn;
  return { orientation, panelCount, totalFabricLengthIn, cutLengthIn };
}

export function calculateQuiltBacking(input: BackingInput): BackingResult {
  const quiltWidthIn = toIn(input.quiltWidth);
  const quiltLengthIn = toIn(input.quiltLength);
  const fabricWidthIn = toIn(input.fabricWidth);
  const overhangIn = toIn(input.overhangPerSide);
  const seamAllowanceIn = toIn(input.seamAllowance);
  const purchaseIncrementYd = input.purchaseIncrementYd ?? 0.25;
  const directional = input.directionalFabric ?? false;

  const warnings: CalculationWarning[] = [];
  if (fabricWidthIn <= 0) {
    warnings.push({ code: 'fabric_width', message: 'Fabric width must be greater than zero.' });
  }

  const requiredWidthIn = quiltWidthIn + 2 * overhangIn;
  const requiredLengthIn = quiltLengthIn + 2 * overhangIn;

  // Orientation A: panels run vertically, seams are vertical → panels span
  // the WIDTH, each panel as long as the required length.
  const planVertical = planOrientation(
    'vertical',
    requiredWidthIn,
    requiredLengthIn,
    fabricWidthIn,
    seamAllowanceIn,
  );
  // Orientation B: rotate — panels span the LENGTH, each as long as the width.
  const planHorizontal = planOrientation(
    'horizontal',
    requiredLengthIn,
    requiredWidthIn,
    fabricWidthIn,
    seamAllowanceIn,
  );

  // Directional prints can't be rotated, so only the vertical plan is valid.
  const candidates = directional ? [planVertical] : [planVertical, planHorizontal];
  const best = candidates.reduce((a, b) =>
    b.totalFabricLengthIn < a.totalFabricLengthIn ? b : a,
  );

  const exactYardage = best.totalFabricLengthIn / 36;
  const recommendedPurchaseYardage = roundUpToIncrement(exactYardage, purchaseIncrementYd);

  const panelCuts: PanelCut[] = Array.from({ length: best.panelCount }, (_, i) => ({
    index: i + 1,
    cutWidthIn: fabricWidthIn,
    cutLengthIn: roundTo(best.cutLengthIn, 3),
  }));

  if (best.panelCount === 1) {
    warnings.push({
      code: 'single_width',
      message:
        'One fabric width is wide enough — no piecing needed. Extra-wide backing fabric may cover this without any seam.',
    });
  }

  const assumptions: Assumption[] = [
    { label: 'Overhang per side', value: `${roundTo(overhangIn, 2)} in` },
    { label: 'Usable fabric width', value: `${roundTo(fabricWidthIn, 2)} in` },
    { label: 'Seam allowance', value: `${roundTo(seamAllowanceIn, 3)} in per join` },
    { label: 'Directional print', value: directional ? 'yes (no rotation)' : 'no' },
    { label: 'Purchase rounded up to', value: `${purchaseIncrementYd} yd` },
  ];

  const visualizationData = buildBackingVisualization(
    requiredWidthIn,
    requiredLengthIn,
    quiltWidthIn,
    quiltLengthIn,
    best.orientation,
    best.panelCount,
  );

  return {
    requiredBackingWidthIn: roundTo(requiredWidthIn, 3),
    requiredBackingLengthIn: roundTo(requiredLengthIn, 3),
    fabricWidthIn: roundTo(fabricWidthIn, 3),
    panelCount: best.panelCount,
    seamOrientation: best.orientation,
    exactYardage: roundTo(exactYardage, 4),
    recommendedPurchaseYardage,
    panelCuts,
    assumptions,
    warnings,
    visualizationData,
  };
}

function buildBackingVisualization(
  backW: number,
  backL: number,
  quiltW: number,
  quiltL: number,
  orientation: SeamOrientation,
  panelCount: number,
): VisualizationData {
  const rects: VisualizationData['rects'] = [];
  const seams: NonNullable<VisualizationData['seams']> = [];

  // The full backing rectangle (overhang included).
  rects.push({ x: 0, y: 0, width: backW, height: backL, role: 'overhang', label: 'Backing + overhang' });

  // The quilt top centered inside.
  const offX = (backW - quiltW) / 2;
  const offY = (backL - quiltL) / 2;
  rects.push({ x: offX, y: offY, width: quiltW, height: quiltL, role: 'quilt', label: 'Quilt top' });

  // Seam lines dividing the panels.
  if (panelCount > 1) {
    if (orientation === 'vertical') {
      const panelW = backW / panelCount;
      for (let i = 1; i < panelCount; i++) {
        seams.push({ x1: i * panelW, y1: 0, x2: i * panelW, y2: backL });
      }
    } else {
      const panelH = backL / panelCount;
      for (let i = 1; i < panelCount; i++) {
        seams.push({ x1: 0, y1: i * panelH, x2: backW, y2: i * panelH });
      }
    }
  }

  return {
    boundingWidth: backW,
    boundingHeight: backL,
    rects,
    seams,
    caption:
      panelCount > 1
        ? `${panelCount} panels with ${orientation} seam${panelCount > 2 ? 's' : ''}`
        : 'Single panel — no seam needed',
  };
}

function toIn(m: Measurement): number {
  return convert(m.value, m.unit, 'inch');
}
