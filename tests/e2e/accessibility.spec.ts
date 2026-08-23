import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/quilting/backing-calculator/',
  '/sewing/fabric-yardage-calculator/',
  '/home-decor/curtain-fabric-calculator/',
  '/conversions/fabric-unit-converter/',
];

for (const route of routes) {
  test(`WCAG smoke audit: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();

    const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
}
