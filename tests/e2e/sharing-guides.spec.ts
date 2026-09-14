import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('yardagelab-consent-v1', 'essential-only');
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as unknown as { copied: string }).copied = text; } } });
  });
});

const routes = ['quilting/backing-calculator','quilting/binding-calculator','quilting/quilt-size-calculator','sewing/fabric-yardage-calculator','home-decor/curtain-fabric-calculator','conversions/fabric-unit-converter'];
for (const route of routes) test(`current results can be copied: ${route}`, async ({ page }) => {
  await page.goto(`/${route}/`);
  const field = page.locator('input[type="number"]').first();
  await field.fill('72');
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  const copied = await page.evaluate(() => (window as unknown as { copied: string }).copied);
  expect(copied).toContain('72');
  expect(copied).toContain(`/${route}/`);
  expect(copied).not.toContain('Copy results');
  await expect(page.getByRole('status')).toContainText('Results copied');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('backing boundary, invalid seam, and metric switching', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await page.getByLabel('Quilt top width', { exact: true }).fill('76');
  await page.getByLabel('Directional print').check();
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toContain('7.5');
  await page.getByRole('radio', { name: 'Centimeters', exact: true }).click();
  await expect(page.getByLabel('Quilt top width', { exact: true })).toHaveValue('193.04');
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { copied: string }).copied)).toContain('7.5');
  await page.getByLabel('Seam allowance', { exact: true }).fill('200');
  await expect(page.getByText('Seam allowance must be less than half the fabric width.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy results', exact: true })).toHaveCount(0);
});

test('WhatsApp receives encoded current results, without sending a message', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await page.evaluate(() => { window.open = ((url: string) => { (window as unknown as { opened: string }).opened = url; return null; }) as typeof window.open; });
  await page.getByRole('button', { name: 'WhatsApp', exact: true }).click();
  const url = new URL(await page.evaluate(() => (window as unknown as { opened: string }).opened));
  expect(url.origin).toBe('https://wa.me');
  expect(url.searchParams.get('text')).toContain('Quilt Backing Calculator');
  expect(url.searchParams.get('text')).toContain('Backing fabric to buy');
  expect(url.searchParams.get('text')).toContain('Purchase rounded up to');
});

test('native sharing, cancellation and clipboard failure fallback', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async (data: ShareData) => { (window as unknown as { shared: string }).shared = data.text || ''; } }); });
  await page.getByRole('button', { name: 'Share calculation', exact: true }).click();
  expect(await page.evaluate(() => (window as unknown as { shared: string }).shared)).toContain('Quilt Backing');
  await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: async () => { throw new DOMException('Cancelled', 'AbortError'); } }); });
  await page.getByRole('button', { name: 'Share calculation', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Sharing cancelled.');
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  await expect(page.getByLabel('Results to copy')).toContainText('Backing fabric to buy');
});

test('share falls back to copying when the native share menu is unavailable', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }); });
  await page.getByRole('button', { name: 'Share calculation', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Results copied');
});

test('free PDF download and conversion reference work without signup', async ({ page, request }) => {
  await page.goto('/guides/standard-quilt-sizes/');
  await expect(page.getByRole('table')).toContainText('Queen');
  await expect(page.locator('input[type="email"]')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download free quilt size chart (PDF)' }).click();
  expect((await download).suggestedFilename()).toBe('yardagelab-quilt-size-chart.pdf');
  const pdf = await request.get('/downloads/yardagelab-quilt-size-chart.pdf');
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()['content-type']).toContain('application/pdf');
  expect((await pdf.body()).subarray(0,5).toString()).toBe('%PDF-');
  await page.goto('/guides/fabric-yardage-conversion-chart/');
  await expect(page.getByRole('table')).toContainText('0.2286');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('optional analytics suppresses measurements and honors essential-only choice', async ({ page }) => {
  await page.goto('/quilting/backing-calculator/');
  await page.evaluate(() => { window.dataLayer = []; window.gtag = (...args: unknown[]) => window.dataLayer?.push(args); });
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  expect(await page.evaluate(() => window.dataLayer)).toEqual([]);
  await page.evaluate(() => { localStorage.setItem('yardagelab-consent-v1', 'accepted'); window.dispatchEvent(new Event('yardagelab:consent')); });
  await page.getByLabel('Quilt top width', { exact: true }).fill('73');
  await expect.poll(() => page.evaluate(() => JSON.stringify(window.dataLayer))).toContain('calculation_completed');
  await page.getByRole('button', { name: 'Copy results', exact: true }).click();
  const events = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(events).toContain('copy_results');
  expect(events).not.toContain('73');
  expect(events).not.toContain('Quilt top width');
});
