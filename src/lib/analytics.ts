/**
 * Minimal, privacy-conscious analytics instrumentation.
 *
 * Emits typed product events to `window.dataLayer` / `gtag` when present.
 * No raw measurement inputs are ever sent — only calculator ids and unit
 * systems, per the blueprint's prohibited-tracking rules. Safe to call on the
 * server (becomes a no-op).
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

export function track(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
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
