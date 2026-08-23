/**
 * Shared domain types for all YardageLab calculators.
 *
 * Every calculator returns a result that clearly separates the *exact*
 * mathematical answer from a conservative *purchase recommendation*, and
 * always exposes its assumptions so the number is explainable.
 */

export type LengthUnit = 'inch' | 'foot' | 'yard' | 'mm' | 'cm' | 'meter';

export interface Measurement {
  value: number;
  unit: LengthUnit;
}

/** A single explicit assumption or default that shaped the result. */
export interface Assumption {
  label: string;
  value: string;
}

export interface CalculationWarning {
  code: string;
  message: string;
}

/**
 * Geometry normalised for SVG rendering. Coordinates are in an arbitrary
 * unit-agnostic space; the renderer scales to fit its viewport.
 */
export interface VisualizationRect {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  role: 'quilt' | 'panel' | 'overhang' | 'fabric' | 'seam' | 'piece' | 'border' | 'block';
}

export interface VisualizationData {
  boundingWidth: number;
  boundingHeight: number;
  rects: VisualizationRect[];
  seams?: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  caption: string;
}

/** Base shape shared by every calculator result. */
export interface BaseResult {
  assumptions: Assumption[];
  warnings: CalculationWarning[];
}
