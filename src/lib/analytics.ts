/**
 * Minimal, privacy-conscious analytics instrumentation.
 *
 * Emits typed product events to `window.dataLayer` / `gtag` when present.
 * No raw measurement inputs are ever sent. If the optional consent UI is
 * enabled, events are suppressed until the user explicitly accepts optional
 * analytics.
 */

type AnalyticsEvent =
  | { name: 'calculator_view'; params: { calculator_id: string } }
  | { name: 'calculation_started'; params: { calculator_id: string } }
  | { name: 'calculation_completed'; params: { calculator_id: string; unit_system: string } }
  | { name: 'calculation_error'; params: { calculator_id: string; error_type: string } }
  | { name: 'related_tool_clicked'; params: { from_tool: string; to_tool: string } }
  | { name: 'print_plan'; params: { calculator_id: string } }
  | { name: 'unit_system_changed'; params: { from: string; to: string } };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = 'yardagelab-consent-v1';

function analyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER !== 'true') return true;
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
}

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined' || !analyticsAllowed()) return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event.name, event.params);
    } else if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: event.name, ...event.params });
    }
  } catch {
    /* analytics must never break the calculator */
  }
}
