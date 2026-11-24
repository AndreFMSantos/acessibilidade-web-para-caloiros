import type { CartItem, Game } from '../lib/types';

async function request(path: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(`/api/${path}`, options);
  if (!response.ok) throw new Error(`API: ${response.status}`);
  return response.json();
}
function isGame(value: unknown): value is Game {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'id' in value &&
    typeof value.id === 'string' &&
    'title' in value &&
    typeof value.title === 'string' &&
    'platform' in value &&
    typeof value.platform === 'string' &&
    'genre' in value &&
    typeof value.genre === 'string' &&
    'price' in value &&
    typeof value.price === 'number' &&
    Number.isFinite(value.price) &&
    value.price >= 0 &&
    'description' in value &&
    typeof value.description === 'string' &&
    'edition' in value &&
    typeof value.edition === 'string' &&
    'image' in value &&
    typeof value.image === 'string' &&
    /^\/images\/[a-z0-9-]+\.(jpg|png|webp)$/.test(value.image)
  );
}
function isItem(value: unknown): value is CartItem {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'string' &&
    'gameId' in value &&
    typeof value.gameId === 'string'
  );
}
export async function loadShop(): Promise<{ games: Game[]; items: CartItem[] }> {
  const [games, items] = await Promise.all([request('games'), request('cart')]);
  if (
    !Array.isArray(games) ||
    !games.every(isGame) ||
    !Array.isArray(items) ||
    !items.every(isItem)
  ) {
    throw new Error('Dados inválidos');
  }
  return { games, items };
}
export async function addCartItem(gameId: string): Promise<CartItem> {
  const item = await request('cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: crypto.randomUUID(), gameId }),
  });
  if (!isItem(item)) throw new Error('Resposta inválida');
  return item;
}
export async function removeCartItem(id: string): Promise<void> {
  await request(`cart/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
