import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="YardageLab home"
    >
      <span aria-hidden className="relative inline-flex h-8 w-8 items-center justify-center">
        <svg viewBox="0 0 32 32" className="h-8 w-8">
          <rect x="1.5" y="1.5" width="29" height="29" rx="7" className="fill-teal" />
          {/* ruler ticks */}
          {[8, 13, 18, 23].map((x) => (
            <line
              key={x}
              x1={x}
              y1="6"
              x2={x}
              y2={x % 2 === 0 ? 12 : 10}
              className="stroke-paper-card"
              strokeWidth="1.4"
            />
          ))}
          <path d="M7 22 L16 15 L25 22" className="fill-none stroke-terracotta" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-ink">
        Yardage<span className="text-terracotta">Lab</span>
      </span>
    </Link>
  );
}
