import { Breadcrumb } from '@/components/layout/Breadcrumb';

/** Standard layout for static, legal and reference pages. */
export function ContentPage({
  title,
  intro,
  breadcrumbName,
  breadcrumbPath,
  children,
}: {
  title: string;
  intro?: string;
  breadcrumbName: string;
  breadcrumbPath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pb-8">
      <header className="border-b border-line bg-paper-deep/30">
        <div className="container-prose py-8">
          <Breadcrumb
            items={[
              { name: 'Home', path: '/' },
              { name: breadcrumbName, path: breadcrumbPath },
            ]}
          />
          <h1 className="mt-4 text-4xl font-semibold text-ink sm:text-5xl">{title}</h1>
          {intro && <p className="mt-3 font-sans text-lg text-ink-soft">{intro}</p>}
        </div>
      </header>
      <div className="container-prose py-10">
        <div className="prose-craft">{children}</div>
      </div>
    </div>
  );
}
