import type { LengthUnit } from '@/calculators/types';
import { UNIT_LABEL } from '@/lib/units';

/**
 * Rounding and display policy.
 *
 * Golden rule: never silently round *down* a material requirement. Exact
 * results and purchase recommendations are always exposed separately so a
 * user can see both the true number and the shop-friendly number.
 */

const EPSILON = 1e-9;

/** Round a value UP to the nearest increment (e.g. 0.25 yd). */
export function roundUpToIncrement(value: number, increment: number): number {
  if (increment <= 0) return value;
  // Guard against binary float noise so 3.0000000001 doesn't become 3.25.
  const scaled = value / increment;
  const rounded = Math.ceil(scaled - EPSILON);
  return roundTo(rounded * increment, 6);
}

/** Round to a fixed number of decimal places (banker-free, half-up). */
export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Human-readable number: trims trailing zeros, caps decimals. */
export function formatNumber(value: number, maxDecimals = 2): string {
  const rounded = roundTo(value, maxDecimals);
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded
    .toFixed(maxDecimals)
    .replace(/0+$/, '')
    .replace(/\.$/, '');
}

export function formatMeasure(value: number, unit: LengthUnit, maxDecimals = 2): string {
  return `${formatNumber(value, maxDecimals)} ${UNIT_LABEL[unit]}`;
}

const FRACTION_DENOMINATOR = 8; // eighths — the practical shop increment

/**
 * Format a value as a mixed fraction (e.g. 2 3/8) for imperial-friendly
 * display. Falls back to a decimal string for the whole part.
 */
export function formatFraction(value: number): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const whole = Math.floor(abs + EPSILON);
  const remainder = abs - whole;
  let numerator = Math.round(remainder * FRACTION_DENOMINATOR);
  let denominator = FRACTION_DENOMINATOR;

  if (numerator === 0) return `${sign}${whole}`;
  if (numerator === denominator) return `${sign}${whole + 1}`;

  // Reduce the fraction.
  const g = gcd(numerator, denominator);
  numerator /= g;
  denominator /= g;

  if (whole === 0) return `${sign}${numerator}/${denominator}`;
  return `${sign}${whole} ${numerator}/${denominator}`;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}
