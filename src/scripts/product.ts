import type { Game } from '../lib/types';
import { euro } from '../lib/format';
import { element } from './dom';

export function updateProduct(games: Game[]) {
  const id = document.body.dataset.gameId;
  if (!id) return;
  const game = games.find((game) => game.id === id);
  if (!game) throw new Error('Oferta indisponível');
  element('#product-title', HTMLHeadingElement).textContent = game.title;
  element('#product-description', HTMLParagraphElement).textContent = game.description;
  element('#product-platform', HTMLElement).textContent = game.platform;
  element('#product-edition', HTMLElement).textContent = game.edition;
  element('#product-genre', HTMLParagraphElement).textContent = game.genre;
  element('#product-image', HTMLImageElement).src = game.image;
  element('#product-price', HTMLParagraphElement).textContent = game.price === 0 ? 'Grátis' : euro.format(game.price);
  document.title = `${game.title} · ${game.platform} — Checkpoint`;
}
