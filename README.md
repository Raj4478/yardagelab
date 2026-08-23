# YardageLab

**Fabric math without the guesswork.** — Free, fast, SEO-first sewing, quilting and fabric
planning calculators. Built with Next.js (App Router), TypeScript (strict), and Tailwind CSS.

Six calculators, each with a deterministic + tested domain function, a visual cutting plan, and a
full content page (methodology, worked example, reference, FAQ):

| Calculator | Route |
| --- | --- |
| Quilt Backing | `/quilting/backing-calculator/` |
| Quilt Binding | `/quilting/binding-calculator/` |
| Quilt Size | `/quilting/quilt-size-calculator/` |
| Fabric Yardage | `/sewing/fabric-yardage-calculator/` |
| Curtain Fabric | `/home-decor/curtain-fabric-calculator/` |
| Fabric Unit Converter | `/conversions/fabric-unit-converter/` |

---

## Quick start

> Requires **Node.js 18.17+** (works on Node 18 and 20). Examples use `npm`; `pnpm`/`yarn` work too.

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

> **Why `--legacy-peer-deps`?** Some npm 10 versions report a spurious peer-dependency conflict for
> `react` on first install. The flag sidesteps it; the installed tree is correct. Plain
> `npm install` also works on most setups (an `.npmrc` in the repo already sets this flag).

### Troubleshooting a slow or hanging install

If `npm install` hangs for a long time or fails with `ENETUNREACH` on an **IPv6** address, your
network has a broken IPv6 route to the npm registry. Force IPv4 and it installs in seconds:

```bash
NODE_OPTIONS=--dns-result-order=ipv4first npm install
```

The same prefix helps the first `npm run build`, which downloads the Google fonts:

```bash
NODE_OPTIONS=--dns-result-order=ipv4first npm run build
```

---

## Available scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at `localhost:3000` |
| `npm run build` | Production build |
| `npm start` | Serve the production build (run `build` first) |
| `npm test` | Run the Vitest unit + golden test suite |
| `npm run test:watch` | Run tests in watch mode |
| `npm run typecheck` | TypeScript type check (no emit) |

> **Linting (optional):** to enable `next lint`, install the tooling and add a `lint` script:
> `npm i -D eslint eslint-config-next` (an `.eslintrc.json` is already included). It was left out of
> the default dependencies to keep the install lean; builds never block on it.

---

## Testing the calculators

All calculator math lives in pure, framework-free functions under `src/calculators/` and is covered
by **golden tests** (expert-verified input/output tables) in `tests/`.

```bash
npm test
```

You should see the units, rounding and all six calculator suites pass. To try the UI by hand, run
`npm run dev` and, for example, open the quilt backing calculator, enter a 60 × 80 quilt on 42″
fabric with 4″ overhang — it should recommend **5 yd** across **2 vertical panels**.

---

## Project structure

```
app/                      # Next.js App Router pages, routes, sitemap.ts, robots.ts
  (hubs)/…/page.tsx       # Category hubs + calculator pages
  layout.tsx              # Root layout, fonts, header/footer, global JSON-LD
src/
  calculators/            # Pure, deterministic domain math (the tested core)
  components/
    calculators/          # Interactive calculator UI (client components)
    content/              # Page scaffolds, hubs, long-form sections
    layout/               # Header, footer, breadcrumb, logo
    seo/                  # Structured-data injector
  lib/                    # units, rounding, validation, seo, registry, site, analytics
tests/                    # Vitest unit + golden tests
```

`src/lib/registry.ts` is the single source of truth for calculators, hubs and static pages — it
drives navigation, breadcrumbs, the sitemap and internal linking. Add a calculator there to wire it
into all of them.

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for design decisions and the calculation methodology
lives at `/calculation-methodology/` in the running app.

---

## Configuration

Copy `.env.example` to `.env.local` and set values as needed:

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical production origin used for canonicals + sitemap | `https://yardagelab.com` |
| `NEXT_PUBLIC_ALLOW_INDEX` | Set `false` to force `noindex` even in production | unset |

**Indexing is safe by default:** `robots.ts` and `sitemap.ts` only open the site to search engines
when `VERCEL_ENV=production`. Preview and development builds emit `noindex` + an empty sitemap, so
staging can never leak into search.

Analytics is a no-op until a real `gtag`/`dataLayer` is present (`src/lib/analytics.ts`). No
non-essential cookies are set out of the box.

---

## Deploying

The app is a standard Next.js project and deploys to **Vercel** with zero config (framework preset =
Next.js). Set `NEXT_PUBLIC_SITE_URL` to your domain in the Vercel project settings. Point DNS
(e.g. via Cloudflare) at Vercel, then submit `https://yourdomain.com/sitemap.xml` in Google Search
Console.

---

## License

Provided as a project starter for the owner. Review the legal page templates
(`/privacy-policy/`, `/cookie-policy/`, `/terms/`) with a qualified professional before launch.
