import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import seed from '../data/seed.json' with { type: 'json' };

test('o nome do carrinho acompanha o número de jogos', async ({ page }) => {
  await page.route('**/api/games', (route) => route.fulfill({ json: seed.games }));
  await page.route('**/api/cart', (route) => {
    const item = { id: 'item-1', gameId: seed.games[0].id };
    return route.fulfill({ json: route.request().method() === 'POST' ? item : [] });
  });

  await page.goto('/');
  const cart = page.locator('#open-cart');
  await expect(cart).toHaveAccessibleName('Abrir carrinho — 0 jogos');

  await page.locator(`[data-add-game="${seed.games[0].id}"]`).click();
  await expect(cart).toHaveAccessibleName('Abrir carrinho — 1 jogo');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
