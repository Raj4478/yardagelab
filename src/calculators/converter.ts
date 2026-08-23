import type { LengthUnit } from './types';
import { convert, UNIT_LABEL, isImperial } from '@/lib/units';
import { formatFraction, formatNumber } from '@/lib/rounding';

/**
 * Fabric unit converter.
 *
 * Converts a length/quantity between any two supported units using the single
 * canonical base unit defined in lib/units. For imperial targets it also
 * offers a shop-friendly fraction (nearest ⅛).
 */

export interface ConvertInput {
  value: number;
  fromUnit: LengthUnit;
  toUnit: LengthUnit;
}

export interface ConvertResult {
  value: number;
  formattedValue: string;
  /** Fraction form for imperial targets, else null. */
  fractionValue: string | null;
}

export function convertFabricUnits(input: ConvertInput): ConvertResult {
  const value = convert(input.value, input.fromUnit, input.toUnit);
  const formattedValue = `${formatNumber(value, 4)} ${UNIT_LABEL[input.toUnit]}`;
  const fractionValue = isImperial(input.toUnit)
    ? `${formatFraction(value)} ${UNIT_LABEL[input.toUnit]}`
    : null;
  return { value, formattedValue, fractionValue };
}
