# Architecture

YardageLab is a **static-first Next.js App Router** site. The guiding idea from the product blueprint: *utility first, minimal infrastructure, deterministic and explainable math.*

## Layers

1. **Domain math — `src/calculators/`**
   Pure, framework-free TypeScript functions. No React, no I/O. Each returns a standard result shape that separates the **exact** requirement from a conservative **purchase recommendation**, plus `assumptions`, `warnings` and normalized `visualizationData` for the SVG cutting plan. This is the only place calculation logic lives, and it is the layer the golden tests target.

2. **Shared libraries — `src/lib/`**
   - `units.ts` — one canonical base unit (millimeter) + exact conversion constants. All unit math goes through here; constants are never duplicated.
   - `rounding.ts` — "never round material down" policy, purchase increments, display + fraction formatting.
   - `validation.ts` — dependency-free numeric field validation.
   - `registry.ts` — single source of truth for calculators, hubs and static pages.
   - `seo.ts` / `site.ts` — metadata + JSON-LD generators and canonical URL helpers.
   - `analytics.ts` — typed, privacy-conscious event emitter (no raw measurements sent).

3. **UI — `src/components/`**
   - `calculators/` — client components. Each calculator owns its form state via the `useCalcFields` hook, computes its result with `useMemo`, and renders through shared result primitives + the `CuttingPlan` SVG. `ToolShell` gives every calculator the same two-column layout, unit toggle and print action.
   - `content/` — server components that assemble pages: `CalculatorScaffold` enforces the blueprint's page order; `HubPage`, `ContentPage`, `sections` provide reusable page structure.
   - `layout/`, `seo/` — chrome and the JSON-LD injector.

4. **Routing — `app/`**
   Static generation by default. Only the interactive calculator islands are client components; all explanatory content is server-rendered static HTML. `robots.ts` and `sitemap.ts` are generated from the registry and are environment-aware (production-only indexing).

## Key decisions

- **Exact vs. purchase split** is a first-class part of every result type, not a UI afterthought.
- **Millimeter base unit** makes conversions reversible and keeps results identical across unit systems — verified by tests.
- **Registry-driven** nav/sitemap/breadcrumbs means adding a calculator is a single-file change plus its page and tests.
- **No database, no auth** for the MVP, per the blueprint's out-of-scope list.
- **SEO safety by default**: canonical self-references, environment-gated indexing, structured data that only reflects visible content (no invented ratings/reviews).

## Design system

Warm "cutting-table" aesthetic: cream paper background, terracotta + deep-teal ink accents, a `Fraunces` serif display face paired with `Hanken Grotesk` body and `JetBrains Mono` for figures. Tokens live in `tailwind.config.ts` and `app/globals.css`.

## Testing

- **Golden tests** (`tests/*.test.ts`) pin expert-verified input/output tables for every calculator and assert the invariant that purchase quantity is never below the exact requirement.
- **Unit tests** cover conversion, rounding and fraction formatting.
- Run with `npm test` (Vitest + jsdom).

## Extending

To add a calculator: add its pure function + tests under `src/calculators/` and `tests/`, register it in `src/lib/registry.ts`, build a client island in `src/components/calculators/`, and add its `app/.../page.tsx` using `CalculatorScaffold`. Sitemap, nav, breadcrumbs and internal links update automatically from the registry.
