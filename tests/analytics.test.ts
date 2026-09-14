import { afterEach, expect, it, vi } from 'vitest';
import { analyticsAllowed, flushAnalytics, track } from '@/lib/analytics';
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it('does not crash or track when consent storage is unavailable', () => {
  vi.stubEnv('NEXT_PUBLIC_ENABLE_CONSENT_BANNER', 'true');
  const gtag = vi.fn();
  vi.stubGlobal('window', { localStorage: { getItem: () => { throw new Error('blocked'); } }, gtag });
  expect(analyticsAllowed()).toBe(false);
  expect(() => track({ name: 'copy_results', params: { calculator_id: 'backing' } })).not.toThrow();
  expect(gtag).not.toHaveBeenCalled();
});
it('flushes consent-approved events when the optional GA script becomes ready', () => {
  vi.stubEnv('NEXT_PUBLIC_ENABLE_CONSENT_BANNER', 'true');
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
  const browser = { localStorage: { getItem: () => 'accepted' }, gtag: undefined as ReturnType<typeof vi.fn> | undefined };
  vi.stubGlobal('window', browser);
  track({ name: 'calculator_view', params: { calculator_id: 'backing' } });
  browser.gtag = vi.fn();
  flushAnalytics();
  expect(browser.gtag).toHaveBeenCalledWith('event', 'calculator_view', { calculator_id: 'backing' });
  flushAnalytics();
  expect(browser.gtag).toHaveBeenCalledTimes(1);
});
it('drops queued events if consent is withdrawn before GA starts', () => {
  vi.stubEnv('NEXT_PUBLIC_ENABLE_CONSENT_BANNER', 'true');
  vi.stubEnv('NEXT_PUBLIC_GA_MEASUREMENT_ID', 'G-TEST123');
  let consent = 'accepted';
  const browser = { localStorage: { getItem: () => consent }, gtag: undefined as ReturnType<typeof vi.fn> | undefined };
  vi.stubGlobal('window', browser);
  track({ name: 'calculator_view', params: { calculator_id: 'backing' } });
  consent = 'essential-only';
  browser.gtag = vi.fn();
  flushAnalytics();
  expect(browser.gtag).not.toHaveBeenCalled();
});
