# YardageLab

**Fabric math without the guesswork.** YardageLab is a static-first Next.js utility site for sewing, quilting and fabric planning. It combines deterministic calculators, visual result plans, evergreen reference guides and a production SEO/quality toolchain.

## Current product surface

- Quilt Backing Calculator — `/quilting/backing-calculator/`
- Quilt Binding Calculator — `/quilting/binding-calculator/`
- Quilt Size Calculator — `/quilting/quilt-size-calculator/`
- Fabric Yardage Calculator — `/sewing/fabric-yardage-calculator/`
- Curtain Fabric Calculator — `/home-decor/curtain-fabric-calculator/`
- Fabric Unit Converter — `/conversions/fabric-unit-converter/`
- Evergreen supporting guides — `/guides/`

Calculator math lives in pure functions under `src/calculators/`; UI and routing do not own domain formulas.

## Runtime

- Node.js `>=22.13 <25`
- Next.js `16.2.11` (patched Active-LTS line at the time of this branch)
- React `19.2.8`
- TypeScript strict mode
- Tailwind CSS

Framework/security versions are operational dependencies, not permanent architectural choices. Keep them on supported patched release lines and let Dependabot surface updates.

## Local setup

```bash
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:3000`.

Before merging dependency changes, generate and commit a fresh `package-lock.json` from the supported Node/npm toolchain so CI can move from `npm install` to `npm ci`.

## Quality commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run audit:site
npm run healthcheck
npm run lighthouse
```

`npm run audit:site` crawls the configured same-origin site, reads `robots.txt`, checks status codes, titles, descriptions, canonicals, H1 counts, duplicate titles and orphan-page signals, and writes `reports/seo-audit.json`.

Use a different target with:

```bash
SITE_URL=https://example.com npm run audit:site
SITE_URL=https://example.com npm run healthcheck
```

## Repository structure

```text
app/                         Next.js App Router pages, sitemap and robots
src/calculators/             pure deterministic domain calculations
src/components/calculators/  interactive tool UI
src/components/content/      shared page/hub scaffolds
src/components/layout/       header, footer, breadcrumbs and brand UI
src/components/privacy/      consent scaffold for future optional tags
src/components/seo/          structured-data rendering
src/lib/                     units, rounding, validation, SEO, registry, guides, analytics
scripts/                     SEO crawler and production health utilities
tests/                       unit/golden tests
tests/e2e/                   Playwright smoke and WCAG checks
.github/workflows/            CI and scheduled production audits
```

## Architecture rules

1. Calculator formulas must remain pure and independently testable.
2. Exact mathematical requirements and purchase recommendations must remain separate.
3. Formula changes require regression/golden tests and domain review.
4. New indexable pages must solve a distinct user task; do not create keyword doorway pages.
5. Preview/development deployments must stay non-indexable.
6. Supporting content must link to relevant tools and add real reference value.
7. Optional analytics or ad tags must respect the consent state where consent is required.
8. Do not add a database, authentication or server API until a proven product feature requires persistence.

## Environment

Copy `.env.example` to `.env.local`.

- `NEXT_PUBLIC_SITE_URL` — canonical production origin.
- `NEXT_PUBLIC_ALLOW_INDEX=false` — emergency/controlled production noindex override.
- `NEXT_PUBLIC_ENABLE_CONSENT_BANNER=true` — enables the optional-tag consent UI when an actual analytics/ad provider is introduced.

Vercel provides `VERCEL_ENV`; `robots.ts` and `sitemap.ts` use production state to prevent preview indexation.

## CI/CD

Pull requests run:

- TypeScript
- ESLint
- unit/golden tests
- production build
- Playwright desktop/mobile smoke tests
- axe WCAG smoke checks
- internal SEO crawl
- health checks
- Lighthouse CI

`production-readiness` adds these gates without moving calculator formulas into new layers or changing the existing route taxonomy.

## Deployment

Recommended topology:

```text
GitHub -> Vercel -> Cloudflare DNS/security -> public domain
```

After production launch:

1. Set `NEXT_PUBLIC_SITE_URL` to the real canonical domain.
2. Set repository variable `SITE_URL` to the live URL to enable the scheduled weekly GitHub site audit.
3. Verify Search Console domain ownership and submit `/sitemap.xml`.
4. Validate `/robots.txt`, canonicals and critical calculator routes.
5. Keep advertising disabled until the site has useful indexed content and meaningful traffic.

## Privacy and ads

The project does not load a real analytics or advertising provider by default. The consent component is a scaffold only. Before enabling ads or non-essential analytics, configure the actual vendor, jurisdiction-appropriate consent behavior, policy text, retention details, ads.txt where required and working contact details.

## Operations

See `OPERATIONS.md` for launch checks, incident runbooks, crawler operations and SEO maintenance.

## License

Provided as a project starter for the owner. Finalize legal/privacy pages for the actual operator and vendors before public monetization.
