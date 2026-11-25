import { euro } from '../lib/format';
import type { CartItem, Game } from '../lib/types';
import { addCartItem, removeCartItem } from './api';
import { element, showError } from './dom';

export function initCart(games: Game[], initialItems: CartItem[]) {
  let items = initialItems;
  const cart = element('#cart', HTMLDialogElement);
  const open = element('#open-cart', HTMLButtonElement);
  const close = element('#close-cart', HTMLButtonElement);
  const status = element('#cart-status', HTMLParagraphElement);
  const error = element('#api-error', HTMLParagraphElement);
  const list = element('#cart-items', HTMLUListElement);
  const template = element('#cart-item-template', HTMLTemplateElement);
  const empty = element('#cart-empty-template', HTMLTemplateElement);
  const removalStatus = element('#cart-removal-status', HTMLParagraphElement);

  function render() {
    element('[data-cart-count]', HTMLSpanElement).textContent = String(items.length);
    open.setAttribute(
      'aria-label',
      `Abrir carrinho — ${items.length} ${items.length === 1 ? 'jogo' : 'jogos'}`,
    );
    const rows = items.flatMap((item) => {
      const game = games.find((game) => game.id === item.gameId);
      if (!game) return [];
      const row = template.content.cloneNode(true);
      if (!(row instanceof DocumentFragment)) throw new Error('Template inválido');
      const title = row.querySelector('[data-cart-title]');
      const price = row.querySelector('[data-cart-price]');
      const remove = row.querySelector('button');
      if (!title || !price || !remove) throw new Error('Template incompleto');
      title.textContent = `${game.title} · ${game.platform}`;
      price.textContent = euro.format(game.price);
      remove.textContent = `Remover ${game.title}`;
      remove.dataset.removeItem = item.id;
      return [row];
    });
    list.replaceChildren(...(rows.length ? rows : [empty.content.cloneNode(true)]));
    const total = items.reduce(
      (sum, item) => sum + (games.find((game) => game.id === item.gameId)?.price ?? 0),
      0,
    );
    element('#cart-total', HTMLParagraphElement).textContent = `Total: ${euro.format(total)}`;
  }

  open.addEventListener('click', () => cart.showModal());
  close.addEventListener('click', () => cart.close());
  cart.addEventListener('close', () => open.focus());
  list.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button');
    const id = button?.dataset.removeItem;
    if (!button || !id || button.getAttribute('aria-disabled') === 'true') return;
    // aria-disabled (e não disabled) para o botão não perder o foco enquanto o pedido corre.
    button.setAttribute('aria-disabled', 'true');
    const removed = items.find((item) => item.id === id);
    const removedTitle = games.find((game) => game.id === removed?.gameId)?.title ?? 'O jogo';
    const position = [...list.querySelectorAll('[data-remove-item]')].indexOf(button);
    try {
      await removeCartItem(id);
      items = items.filter((item) => item.id !== id);
      render();
      // Se ainda há jogos, o foco vai para o "Remover" que ocupa o lugar do removido;
      // só quando o carrinho fica vazio é que vai para "Fechar".
      const remaining = list.querySelectorAll<HTMLButtonElement>('[data-remove-item]');
      (remaining[Math.min(position, remaining.length - 1)] ?? close).focus();
      removalStatus.textContent = '';
      removalStatus.textContent = `${removedTitle} foi removido do carrinho. ${
        items.length === 0
          ? 'O carrinho está vazio.'
          : `${items.length} ${items.length === 1 ? 'jogo' : 'jogos'} no carrinho.`
      }`;
    } catch {
      showError('Não foi possível remover o jogo. Tenta novamente.');
      button.removeAttribute('aria-disabled');
    }
  });
  document.querySelectorAll<HTMLButtonElement>('[data-add-game]').forEach((button) => {
    button.disabled = !games.some((game) => game.id === button.dataset.addGame);
  });
  document.addEventListener('click', async (event) => {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest('button[data-add-game]');
    if (
      !(button instanceof HTMLButtonElement) ||
      button.disabled ||
      button.getAttribute('aria-disabled') === 'true'
    )
      return;
    const game = games.find((game) => game.id === button.dataset.addGame);
    if (!game) return;
    button.setAttribute('aria-disabled', 'true');
    error.hidden = true;
    status.textContent = '';
    try {
      items.push(await addCartItem(game.id));
      render();
      status.textContent = `${game.title} foi adicionado ao carrinho. ${items.length} ${items.length === 1 ? 'jogo' : 'jogos'} no total.`;
    } catch {
      showError(
        'Não foi possível adicionar o jogo. Confirma que a API está a funcionar e tenta novamente.',
      );
    } finally {
      button.removeAttribute('aria-disabled');
    }
  });
  render();
}
