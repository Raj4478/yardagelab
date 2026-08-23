import Link from 'next/link';
import { StructuredData } from '@/components/seo/StructuredData';
import { breadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo';

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-sans text-sm">
      <StructuredData data={breadcrumbJsonLd(items)} />
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-faint">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="font-medium text-ink-soft">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link href={item.path} className="transition hover:text-terracotta">
                    {item.name}
                  </Link>
                  <span aria-hidden className="text-line">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
