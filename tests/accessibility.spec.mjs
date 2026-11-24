import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import seed from '../data/seed.json' with { type: 'json' };
import * as routes from '../src/lib/versions.ts';

const versions = routes.versions ?? [{ name: '' }];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/games', (route) => route.fulfill({ json: seed.games }));
  await page.route('**/api/cart', (route) => route.fulfill({ json: [] }));
});

for (const version of versions) {
  const pages = [
    { path: routes.cataloguePath(version.name), type: 'catálogo' },
    ...seed.games.map((game) => ({
      path: routes.productPath(game.id, version.name),
      type: 'detalhe',
    })),
  ];

  for (const { path, type } of pages) {
    test(`axe: ${path}`, async ({ page }, testInfo) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      if (type === 'catálogo') {
        await expect(page.locator('[data-game-card]:visible')).toHaveCount(seed.games.length);
      } else {
        await expect(page.locator('#product-add')).toBeEnabled();
      }

      const results = await new AxeBuilder({ page }).analyze();
      await testInfo.attach('axe-results', {
        body: JSON.stringify(results, null, 2),
        contentType: 'application/json',
      });

      expect(results.violations).toEqual([]);
    });
  }
}
