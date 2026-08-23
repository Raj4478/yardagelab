'use client';

import Link from 'next/link';
import { useState } from 'react';
import { HUBS } from '@/lib/registry';
import { Logo } from './Logo';

const NAV = Object.values(HUBS);

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((hub) => (
            <Link
              key={hub.id}
              href={hub.route}
              className="rounded-full px-3.5 py-2 font-sans text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
            >
              {hub.title.replace(' Calculators', '').replace(' & Reference', '')}
            </Link>
          ))}
          <Link href="/calculation-methodology/" className="ml-1 btn-ghost">
            How it works
          </Link>
        </nav>

        <button
          type="button"
          className="btn-ghost md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line/70 bg-paper md:hidden"
        >
          <div className="container-wide flex flex-col py-2">
            {NAV.map((hub) => (
              <Link
                key={hub.id}
                href={hub.route}
                className="rounded-lg px-3 py-3 font-sans text-base font-medium text-ink-soft hover:bg-ink/5"
                onClick={() => setOpen(false)}
              >
                {hub.title}
              </Link>
            ))}
            <Link
              href="/calculation-methodology/"
              className="rounded-lg px-3 py-3 font-sans text-base font-medium text-teal hover:bg-ink/5"
              onClick={() => setOpen(false)}
            >
              How it works
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
