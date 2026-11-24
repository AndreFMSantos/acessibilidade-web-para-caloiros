export {};
import { productPath } from '../lib/versions';

interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  price: number;
  image: string;
  description: string;
  edition: string;
}
interface CartItem { id: string; gameId: string }

function element<T extends Element>(selector: string, constructor: { new (): T }): T {
  const node = document.querySelector(selector);
  if (!(node instanceof constructor)) throw new Error(`Elemento em falta: ${selector}`);
  return node;
}

const list = document.querySelector<HTMLUListElement>('#games');
const search = document.querySelector<HTMLInputElement>('#search');
const sort = document.querySelector<HTMLSelectElement>('#sort');
const results = document.querySelector<HTMLParagraphElement>('#results');
const status = element('#cart-status', HTMLParagraphElement);
const error = element('#api-error', HTMLParagraphElement);
const cart = element('#cart', HTMLDialogElement);
const cartButton = element('#open-cart', HTMLButtonElement);
const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
let games: Game[] = [];
let items: CartItem[] = [];
let platform = 'Todas';
const gameId = document.body.dataset.gameId;

async function request(path: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(`/api/${path}`, options);
  if (!response.ok) throw new Error(`API: ${response.status}`);
  return response.json();
}
function isGame(value: unknown): value is Game {
  if (typeof value !== 'object' || value === null) return false;
  return 'id' in value && typeof value.id === 'string'
    && 'title' in value && typeof value.title === 'string'
    && 'platform' in value && typeof value.platform === 'string'
    && 'genre' in value && typeof value.genre === 'string'
    && 'price' in value && typeof value.price === 'number' && Number.isFinite(value.price) && value.price >= 0
    && 'description' in value && typeof value.description === 'string'
    && 'edition' in value && typeof value.edition === 'string'
    && 'image' in value && typeof value.image === 'string' && /^\/images\/[a-z0-9-]+\.(jpg|png|webp)$/.test(value.image);
}
function isItem(value: unknown): value is CartItem {
  return typeof value === 'object' && value !== null && 'id' in value && typeof value.id === 'string'
    && 'gameId' in value && typeof value.gameId === 'string';
}
function text<K extends keyof HTMLElementTagNameMap>(tag: K, content: string, className?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.textContent = content;
  if (className) node.className = className;
  return node;
}
function showError(message: string) { error.textContent = message; error.hidden = false; }
function renderGames() {
  if (!list || !search || !sort || !results) return;
  const query = search.value.trim().toLocaleLowerCase('pt-PT');
  const visible = games.filter((game) => (platform === 'Todas' || game.platform === platform)
    && game.title.toLocaleLowerCase('pt-PT').includes(query));
  if (sort.value === 'price') visible.sort((a, b) => a.price - b.price);
  list.replaceChildren(...visible.map((game) => {
    const li = document.createElement('li');
    const article = document.createElement('article');
    const image = new Image(460, 215);
    image.src = game.image;
    image.alt = '';
    image.loading = 'lazy';
    image.style.viewTransitionName = `cover-${game.id}`;
    const cover = document.createElement('a');
    cover.href = productPath(game.id);
    cover.setAttribute('aria-label', `Ver ${game.title} para ${game.platform}`);
    cover.append(image);
    article.append(cover);
    const meta = text('div', '', 'game-meta');
    const heading = document.createElement('h3');
    const link = text('a', game.title);
    link.href = productPath(game.id);
    heading.append(link);
    meta.append(text('p', `${game.platform} / ${game.genre}`, 'game-category'), heading);
    const row = text('div', '', 'purchase');
    const button = text('button', 'Adicionar ao carrinho');
    button.type = 'button';
    button.addEventListener('click', () => void add(game, button));
    row.append(text('p', game.price === 0 ? 'Grátis' : euro.format(game.price), 'price'), button);
    meta.append(row); article.append(meta); li.append(article);
    return li;
  }));
  results.textContent = `${visible.length} ${visible.length === 1 ? 'jogo disponível' : 'jogos disponíveis'}`;
  element('#empty', HTMLParagraphElement).hidden = visible.length !== 0;
}
function renderCart() {
  element('[data-cart-count]', HTMLSpanElement).textContent = String(items.length);
  const rows = items.map((item) => {
    const game = games.find((game) => game.id === item.gameId);
    const li = document.createElement('li');
    if (!game) return li;
    li.append(text('span', `${game.title} · ${game.platform}`), text('strong', euro.format(game.price)));
    const remove = text('button', `Remover ${game.title}`);
    remove.type = 'button';
    remove.addEventListener('click', async () => {
      remove.disabled = true;
      try {
        await request(`cart/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
        items = items.filter((entry) => entry.id !== item.id);
        renderCart();
        element('#close-cart', HTMLButtonElement).focus();
      } catch { showError('Não foi possível remover o jogo. Tenta novamente.'); remove.disabled = false; }
    });
    li.append(remove); return li;
  });
  if (rows.length === 0) rows.push(text('li', 'O carrinho está vazio.'));
  element('#cart-items', HTMLUListElement).replaceChildren(...rows);
  const total = items.reduce((sum, item) => sum + (games.find((game) => game.id === item.gameId)?.price ?? 0), 0);
  element('#cart-total', HTMLParagraphElement).textContent = `Total: ${euro.format(total)}`;
}
async function add(game: Game, button: HTMLButtonElement) {
  if (button.getAttribute('aria-disabled') === 'true') return;
  button.setAttribute('aria-disabled', 'true');
  error.hidden = true;
  status.textContent = '';
  try {
    const result = await request('cart', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: crypto.randomUUID(), gameId: game.id }),
    });
    if (!isItem(result)) throw new Error('Resposta inválida');
    items.push(result);
    renderCart();
    status.textContent = `${game.title} foi adicionado ao carrinho. ${items.length} ${items.length === 1 ? 'jogo' : 'jogos'} no total.`;
  } catch { showError('Não foi possível adicionar o jogo. Confirma que a API está a funcionar e tenta novamente.'); }
  finally { button.removeAttribute('aria-disabled'); }
}
function setPlatform(value: string) { platform = value; renderGames(); }
search?.addEventListener('input', renderGames);
sort?.addEventListener('change', renderGames);
document.querySelector('[data-platform-select]')?.addEventListener('change', (event) => {
  if (event.target instanceof HTMLSelectElement) setPlatform(event.target.value);
});
cartButton.addEventListener('click', () => cart.showModal());
element('#close-cart', HTMLButtonElement).addEventListener('click', () => cart.close());
cart.addEventListener('close', () => cartButton.focus());

async function load() {
  try {
    const [catalogue, cartData] = await Promise.all([request('games'), request('cart')]);
    if (!Array.isArray(catalogue) || !catalogue.every(isGame) || !Array.isArray(cartData) || !cartData.every(isItem)) throw new Error('Dados inválidos');
    games = catalogue; items = cartData;
    renderGames(); renderCart();
    if (gameId) {
      const game = games.find((game) => game.id === gameId);
      if (!game) throw new Error('Oferta indisponível');
      element('#product-title', HTMLHeadingElement).textContent = game.title;
      element('#product-description', HTMLParagraphElement).textContent = game.description;
      element('#product-platform', HTMLElement).textContent = game.platform;
      element('#product-edition', HTMLElement).textContent = game.edition;
      element('#product-genre', HTMLParagraphElement).textContent = game.genre;
      element('#product-image', HTMLImageElement).src = game.image;
      element('#product-price', HTMLParagraphElement).textContent = game.price === 0 ? 'Grátis' : euro.format(game.price);
      document.title = `${game.title} · ${game.platform} — Checkpoint`;
      const button = element('#product-add', HTMLButtonElement);
      button.disabled = false;
      button.addEventListener('click', () => void add(game, button));
    }
    restoreCatalogue();
  } catch {
    if (results) results.textContent = 'Catálogo indisponível.';
    showError('Não conseguimos carregar a oferta. Confirma que a API está a funcionar e volta a carregar a página.');
  }
}

// Guardar só o estado da pesquisa deste separador ao abrir um produto.
// O carrinho continua exclusivamente na API.
document.addEventListener('click', (event) => {
  if (!list || !search || !sort || !(event.target instanceof Element)) return;
  const link = event.target.closest('a');
  if (!link?.pathname.includes('/jogos/')) return;
  try {
    sessionStorage.setItem('catalogue', JSON.stringify({ query: search.value, sort: sort.value, platform }));
  } catch { /* Navegação continua mesmo quando o armazenamento não está disponível. */ }
});
function restoreCatalogue() {
  if (!list || !search || !sort) return;
  try {
    const raw = sessionStorage.getItem('catalogue');
    if (!raw) return;
    const saved: unknown = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null) return;
    if ('query' in saved && typeof saved.query === 'string') search.value = saved.query;
    if ('sort' in saved && (saved.sort === 'featured' || saved.sort === 'price')) sort.value = saved.sort;
    if ('platform' in saved && typeof saved.platform === 'string'
      && ['Todas', 'PC', 'PlayStation 5', 'Nintendo Switch'].includes(saved.platform)) {
      platform = saved.platform;
      const select = document.querySelector<HTMLSelectElement>('[data-platform-select]');
      if (select) select.value = platform;
    }
    renderGames();
  } catch { /* Sem armazenamento, o catálogo abre no estado inicial. */ }
}
void load();
