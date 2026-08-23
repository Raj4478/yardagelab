import Link from 'next/link';
import { HUBS, calculatorsInHub } from '@/lib/registry';
import { SITE } from '@/lib/site';
import { Logo } from './Logo';

const LEGAL = [
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
  { href: '/editorial-policy/', label: 'Editorial Policy' },
  { href: '/calculation-methodology/', label: 'Methodology' },
  { href: '/privacy-policy/', label: 'Privacy' },
  { href: '/cookie-policy/', label: 'Cookies' },
  { href: '/terms/', label: 'Terms' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-paper-deep/60">
      <div className="ruler-tape" aria-hidden />
      <div className="container-wide grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(2,1fr)]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-ink-soft">
            {SITE.description}
          </p>
          <p className="mt-4 chip">Free · US-first · No sign-up</p>
        </div>

        {[
          [HUBS.quilting, HUBS.sewing],
          [HUBS['home-decor'], HUBS.conversions],
        ].map((column, i) => (
          <div key={i} className="space-y-6">
            {column.map((hub) => (
              <div key={hub.id}>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink-faint">
                  {hub.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {calculatorsInHub(hub.id).map((c) => (
                    <li key={c.id}>
                      <Link
                        href={c.route}
                        className="font-sans text-sm text-ink-soft transition hover:text-terracotta"
                      >
                        {c.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container-wide flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-ink-faint">
            © {SITE.name}. Calculators are guidance — always confirm before cutting.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="font-sans text-xs text-ink-faint hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
