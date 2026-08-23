'use client';

import { useEffect, useState } from 'react';

type ConsentState = 'accepted' | 'essential-only';
const STORAGE_KEY = 'yardagelab-consent-v1';

export function ConsentBanner() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_CONSENT_BANNER === 'true';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    setVisible(localStorage.getItem(STORAGE_KEY) === null);
  }, [enabled]);

  if (!enabled || !visible) return null;

  const save = (state: ConsentState) => {
    localStorage.setItem(STORAGE_KEY, state);
    window.dispatchEvent(new CustomEvent('yardagelab:consent', { detail: state }));
    setVisible(false);
  };

  return (
    <aside className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-line bg-paper-card p-5 shadow-lift" aria-label="Privacy choices">
      <h2 className="font-display text-xl font-semibold text-ink">Privacy choices</h2>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-soft">
        YardageLab can run with essential storage only. If analytics or advertising is enabled later, optional tags must wait for your choice where consent is required.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn-primary" onClick={() => save('accepted')}>Allow optional analytics</button>
        <button type="button" className="btn-ghost" onClick={() => save('essential-only')}>Essential only</button>
        <a href="/cookie-policy/" className="btn-ghost">Cookie policy</a>
      </div>
    </aside>
  );
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'accepted' || value === 'essential-only' ? value : null;
}
