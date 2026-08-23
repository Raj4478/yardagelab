'use client';

import Script from 'next/script';
import { useSyncExternalStore } from 'react';

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
  return window.localStorage.getItem(CONSENT_KEY) === 'accepted';
}

export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const allowed = useSyncExternalStore(subscribe, analyticsAllowed, () => false);

  if (!measurementId || !allowed) return null;

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
        `}
      </Script>
    </>
  );
}
