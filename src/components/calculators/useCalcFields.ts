'use client';

import { useCallback, useState } from 'react';
import type { LengthUnit, Measurement } from '@/calculators/types';
import { convert } from '@/lib/units';
import { formatNumber } from '@/lib/rounding';
import { track } from '@/lib/analytics';

export type WorkingUnit = 'inch' | 'cm';

export function useCalcFields<K extends string>(
  initial: Record<K, string>,
  lengthFields: readonly K[],
  initialUnit: WorkingUnit = 'inch',
) {
  const [values, setValues] = useState<Record<K, string>>(initial);
  const [unit, setUnitState] = useState<WorkingUnit>(initialUnit);

  const setValue = useCallback((key: K, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setUnit = useCallback(
    (next: WorkingUnit) => {
      const prev = unit;
      if (prev === next) return;

      setValues((currentValues) => {
        const converted = { ...currentValues };
        for (const key of lengthFields) {
          const raw = Number(currentValues[key]);
          if (currentValues[key] !== '' && Number.isFinite(raw)) {
            converted[key] = formatNumber(convert(raw, prev, next), 3);
          }
        }
        return converted;
      });

      setUnitState(next);
      track({ name: 'unit_system_changed', params: { from: prev, to: next } });
    },
    [lengthFields, unit],
  );

  const measure = useCallback(
    (key: K): Measurement => ({ value: Number(values[key]), unit: unit as LengthUnit }),
    [values, unit],
  );

  return { values, unit, setValue, setUnit, measure, setValues };
}
