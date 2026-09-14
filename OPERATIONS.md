# YardageLab Operations

## Sharing, downloads and optional analytics

- Every tool offers Copy results, WhatsApp and the native device share menu. Unsupported native sharing falls back to copying; blocked clipboard access reveals selectable text. WhatsApp opens a draft for the user to review and send. No automatic messages are sent.
- Shared text includes the current inputs, units, result and page URL. Measurement values are not added to the URL or analytics events. The recipient receives text, not a saved calculator state.
- The quilt chart is a static PDF at `/downloads/yardagelab-quilt-size-chart.pdf`. It needs no signup and no email service. Rebuild using `python scripts/build-quilt-chart.py` with ReportLab installed, then visually inspect both pages. `src/lib/quilt-sizes.json` supplies the PDF, guide and calculator dimensions. Georgia fonts are optional; `YARDAGELAB_FONT_DIR` can point to their directory.
- GA4 remains optional: omit `NEXT_PUBLIC_GA_MEASUREMENT_ID` to load no Google Analytics script. To enable it, set a valid `G-...` ID and `NEXT_PUBLIC_ENABLE_CONSENT_BANNER=true`, then rebuild. Review `calculator_view`, `calculation_started`, `calculation_completed`, `copy_results`, `share_calculation`, `share_whatsapp`, `print_plan` and `download_chart`. Register `calculator_id` and `chart_id` as event-scoped custom dimensions in GA4.
- A completion event means a valid result remained after an input edit for 800 ms; default prefilled results are not completions. The unit converter currently tracks views and sharing, not completion events. Native share cancellation does not count as a share; WhatsApp events count button clicks, not delivered messages. Download events count clicks, not confirmed file saves.
- Use GA4 acquisition reports for traffic sources. Search keywords remain in Search Console: compare queries and landing pages there, or link the properties in GA4. Do not expect GA4 to identify each visitor's organic search keyword.
- Test against a production build with `npm run test:e2e`. The runner works on Windows and Linux. It enables the consent banner and uses a local canonical origin. `PLAYWRIGHT_BASE_URL` can target an already-running test server built with the same consent setting.

## Launch checklist

- `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` all pass from a clean install.
- Playwright smoke/accessibility suites pass on desktop and mobile projects.
- `npm run audit:site` reports zero errors on the production candidate.
- `/robots.txt` allows production crawling and blocks preview/development deployments.
- `/sitemap.xml` contains only canonical indexable URLs.
- `NEXT_PUBLIC_SITE_URL` is the final canonical origin.
- Production DNS/HTTPS are stable before enabling HSTS on the live host.
- Search Console domain property is verified and the sitemap is submitted.
- Legal/privacy pages reflect the real operator, vendors, retention practices and contact address.
- The support email exists and is monitored.
- Ads and non-essential analytics stay disabled until the actual vendor and consent implementation are reviewed.

## Repository variables

Set GitHub repository variable `SITE_URL` to the live canonical URL after launch. The scheduled `Production Site Audit` workflow will then run health and SEO checks weekly.

## SEO audit workflow

`npm run audit:site` performs a respectful same-origin crawl. It reads robots.txt, follows only internal links, and reports non-200 pages, missing title/description/canonical, abnormal H1 counts, duplicate titles and orphan-page signals.

Useful environment variables:

- `SITE_URL` — crawl origin.
- `AUDIT_MAX_PAGES` — maximum pages, default 250.
- `AUDIT_CONCURRENCY` — parallel requests, default 4.

The report is written to `reports/seo-audit.json` and CI fails on audit errors.

## Routine cadence

### Weekly

- Review Search Console clicks, impressions, indexation and country mix.
- Review scheduled production audit artifact.
- Review dependency/security alerts.
- Improve an existing high-opportunity page before creating a near-duplicate page.

### Monthly

- Review Core Web Vitals and Lighthouse trend.
- Check external links and policy/contact details.
- Sample calculator assumptions and golden cases.
- Review whether ad/analytics scripts changed performance or consent behavior.

### Quarterly

- Review framework/Node support windows.
- Review top calculator formulas with domain references or reviewer notes.
- Review site architecture, internal linking and content cannibalization.
- Run a rollback/recovery exercise.

## Incident runbooks

### Production robots.txt blocks search engines

1. Treat as P0.
2. Verify `VERCEL_ENV`, `NEXT_PUBLIC_ALLOW_INDEX` and `/robots.txt`.
3. Correct configuration and deploy.
4. Re-run `SITE_URL=https://... npm run audit:site`.
5. Validate Search Console and document the root cause.

### Calculator formula defect

1. Stop promoting the affected tool; if the result can cause material waste, disable or revert it.
2. Reproduce the defect as a failing unit/golden test.
3. Correct the pure domain function, not the UI.
4. Obtain domain review for changed assumptions.
5. Update methodology/last-reviewed metadata when applicable.
6. Deploy and verify the known case in Playwright/manual QA.

### SEO traffic decline

1. Do not mass rewrite pages.
2. Compare 28-day and 3-month Search Console periods.
3. Separate sitewide, category and page-level changes.
4. Check deployment history, robots, canonicals, status codes and sitemap before editorial changes.
5. Review current SERPs and improve utility/content only where evidence supports it.

### Failed deployment

1. Roll back to the known-good Vercel deployment if production is materially affected.
2. Diagnose in a branch/PR.
3. Re-run all required CI gates before redeploying.

## Monetization guardrails

- Never place ads inside form controls or result cards.
- Reserve ad dimensions to avoid CLS.
- Keep the primary calculator interaction fast and visible.
- Use ads.txt when required by the selected network.
- Add affiliate links only where contextually useful and disclose them clearly.
- Do not manufacture reviews, expertise or first-hand product experience.
