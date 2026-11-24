import type { Game } from '../lib/types';
import { formatPrice } from '../lib/format';
import { element } from './dom';
import { initPlatformFilter } from './platform-filter';

export function initCatalogue(games: Game[]) {
  const list = document.querySelector<HTMLUListElement>('#games');
  if (!list) return;
  const search = element('#search', HTMLInputElement);
  const sort = element('#sort', HTMLSelectElement);
  const results = element('#results', HTMLParagraphElement);
  const cards = [...list.querySelectorAll<HTMLLIElement>('[data-game-card]')];
  let platform = 'Todas';
  const storageKey = `catalogue:${document.body.dataset.version ?? ''}`;

  for (const card of cards) {
    const game = games.find((game) => game.id === card.dataset.gameCard);
    if (!game) continue;
    const image = card.querySelector('img');
    if (image) image.src = game.image;
    const title = card.querySelector('[data-game-title]');
    if (title) title.textContent = game.title;
    const cover = card.querySelector('[data-game-cover]');
    cover?.setAttribute('aria-label', `Ver ${game.title} para ${game.platform}`);
    const category = card.querySelector('[data-game-category]');
    if (category) category.textContent = `${game.platform} / ${game.genre}`;
    const price = card.querySelector('[data-game-price]');
    if (price) price.textContent = formatPrice(game.price);
  }

  function render() {
    const query = search.value.trim().toLocaleLowerCase('pt-PT');
    const visible = games.filter((game) => (platform === 'Todas' || game.platform === platform)
      && game.title.toLocaleLowerCase('pt-PT').includes(query));
    if (sort.value === 'price') visible.sort((a, b) => a.price - b.price);
    for (const card of cards) card.hidden = true;
    let count = 0;
    for (const game of visible) {
      const card = cards.find((card) => card.dataset.gameCard === game.id);
      if (!card) continue;
      card.hidden = false;
      list?.append(card);
      count++;
    }
    results.textContent = `${count} ${count === 1 ? 'jogo disponível' : 'jogos disponíveis'}`;
    element('#empty', HTMLParagraphElement).hidden = count !== 0;
  }
  initPlatformFilter((value) => { platform = value; render(); });
  search.addEventListener('input', render);
  sort.addEventListener('change', render);
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null');
    if (typeof saved === 'object' && saved !== null) {
      if ('query' in saved && typeof saved.query === 'string') search.value = saved.query;
      if ('sort' in saved && (saved.sort === 'featured' || saved.sort === 'price')) sort.value = saved.sort;
      if ('platform' in saved && typeof saved.platform === 'string'
        && ['Todas', 'PC', 'PlayStation 5', 'Nintendo Switch'].includes(saved.platform)) {
        platform = saved.platform;
        const select = document.querySelector<HTMLSelectElement>('[data-platform-select]');
        if (select) select.value = platform;
        const value = document.querySelector('#platform-value');
        if (value) value.textContent = platform;
      }
    }
  } catch { /* O catálogo funciona mesmo sem armazenamento neste separador. */ }
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('a')?.pathname.includes('/jogos/')) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ query: search.value, sort: sort.value, platform }));
    } catch { /* A navegação continua sem guardar os filtros. */ }
  });
  render();
}
