'use client';
import { useEffect } from 'react';
import { analyticsAllowed, track } from '@/lib/analytics';

export function useCalculatorView(calculatorId: string) {
  useEffect(() => {
    let recorded = false;
    const attempt = () => {
      if (!recorded && analyticsAllowed()) {
        track({ name: 'calculator_view', params: { calculator_id: calculatorId } });
        recorded = true;
      }
    };
    attempt();
    window.addEventListener('yardagelab:consent', attempt);
    return () => window.removeEventListener('yardagelab:consent', attempt);
  }, [calculatorId]);
}
