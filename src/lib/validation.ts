/**
 * Lightweight, dependency-free input validation for calculator forms.
 *
 * Kept deliberately simple: every calculator input is a positive (or
 * non-negative) finite number. Validation returns typed results so the UI
 * can show inline messages before a calculation runs.
 */

export interface FieldError {
  field: string;
  message: string;
}

export interface NumberFieldRule {
  field: string;
  label: string;
  /** Minimum allowed value. Defaults to > 0. */
  min?: number;
  /** If true, allows the exact `min` value (>=). Defaults to false (>). */
  allowMin?: boolean;
  max?: number;
}

export function validateNumber(
  raw: unknown,
  rule: NumberFieldRule,
): { ok: true; value: number } | { ok: false; error: FieldError } {
  const value = typeof raw === 'number' ? raw : Number(raw);
  const min = rule.min ?? 0;

  if (raw === '' || raw === null || raw === undefined || Number.isNaN(value)) {
    return { ok: false, error: { field: rule.field, message: `Enter ${rule.label}.` } };
  }
  if (!Number.isFinite(value)) {
    return { ok: false, error: { field: rule.field, message: `${rule.label} must be a number.` } };
  }
  const belowMin = rule.allowMin ? value < min : value <= min;
  if (belowMin) {
    const bound = rule.allowMin ? `at least ${min}` : `greater than ${min}`;
    return { ok: false, error: { field: rule.field, message: `${rule.label} must be ${bound}.` } };
  }
  if (rule.max !== undefined && value > rule.max) {
    return {
      ok: false,
      error: { field: rule.field, message: `${rule.label} must be ${rule.max} or less.` },
    };
  }
  return { ok: true, value };
}

export function validateAll(
  values: Record<string, unknown>,
  rules: NumberFieldRule[],
): { ok: true; values: Record<string, number> } | { ok: false; errors: FieldError[] } {
  const errors: FieldError[] = [];
  const out: Record<string, number> = {};
  for (const rule of rules) {
    const result = validateNumber(values[rule.field], rule);
    if (result.ok) out[rule.field] = result.value;
    else errors.push(result.error);
  }
  return errors.length ? { ok: false, errors } : { ok: true, values: out };
}
