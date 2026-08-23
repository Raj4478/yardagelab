import { expect, test } from '@playwright/test';

const criticalRoutes = [
  '/',
  '/quilting/backing-calculator/',
  '/quilting/binding-calculator/',
  '/quilting/quilt-size-calculator/',
  '/sewing/fabric-yardage-calculator/',
  '/home-decor/curtain-fabric-calculator/',
  '/conversions/fabric-unit-converter/',
];

test.describe('critical public routes', () => {
  for (const route of criticalRoutes) {
    test(`${route} renders without page errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('h1')).toHaveCount(1);
      expect(errors).toEqual([]);
    });
  }
});

test('quilt backing calculator produces a result and keeps navigation usable', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await expect(page.getByText('Backing fabric to buy')).toBeVisible();
  await expect(page.getByRole('link', { name: /YardageLab/i }).first()).toBeVisible();
});

test('unknown route returns the custom not-found experience', async ({ page }) => {
  const response = await page.goto('/this-route-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading').first()).toBeVisible();
});
