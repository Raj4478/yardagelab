'use client';

import Script from 'next/script';
import { useEffect, useSyncExternalStore } from 'react';
import { flushAnalytics } from '@/lib/analytics';

const CONSENT_KEY = 'yardagelab-consent-v1';
const CONSENT_EVENT = 'yardagelab:consent';

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => undefined;

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_KEY) onStoreChange();
  };
  const handleConsent = () => onStoreChange();

  window.addEventListener('storage', handleStorage);
  window.addEventListener(CONSENT_EVENT, handleConsent);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(CONSENT_EVENT, handleConsent);
  };
}

function analyticsAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER !== 'true') return true;
  try { return window.localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch { return false; }
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const allowed = useSyncExternalStore(subscribe, analyticsAllowed, () => false);
  useEffect(() => {
    window.addEventListener('yardagelab:analytics-ready', flushAnalytics);
    return () => window.removeEventListener('yardagelab:analytics-ready', flushAnalytics);
  }, []);

  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId) || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`}
        strategy="afterInteractive"
      />
      <Script id="yardagelab-ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${measurementId}', { anonymize_ip: true });
          window.dispatchEvent(new Event('yardagelab:analytics-ready'));
        `}
      </Script>
    </>
  );
}
