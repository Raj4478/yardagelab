import Link from 'next/link';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { HUBS, calculatorsInHub, type HubId } from '@/lib/registry';

export function HubPage({ hubId }: { hubId: HubId }) {
  const hub = HUBS[hubId];
  const tools = calculatorsInHub(hubId);

  return (
    <div className="pb-8">
      <header className="border-b border-line bg-paper-deep/30">
        <div className="container-wide py-8">
          <Breadcrumb items={[{ name: 'Home', path: '/' }, { name: hub.title, path: hub.route }]} />
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{hub.title}</h1>
          <p className="mt-3 max-w-2xl font-sans text-lg text-ink-soft">{hub.blurb}</p>
        </div>
      </header>

      <div className="container-wide py-10">
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((c) => (
            <Link
              key={c.id}
              href={c.route}
              className="group card flex flex-col p-6 transition hover:-translate-y-1 hover:shadow-lift"
            >
              <h2 className="font-display text-2xl font-medium text-ink group-hover:text-teal">
                {c.title}
              </h2>
              <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-ink-soft">
                {c.purpose}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 font-sans text-sm font-semibold text-terracotta">
                Open calculator
                <span aria-hidden className="transition group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
