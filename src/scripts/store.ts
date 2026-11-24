import { loadShop } from './api';
import { initCart } from './cart';
import { initCatalogue } from './catalogue';
import { showError } from './dom';
import { updateProduct } from './product';

async function initShop() {
  try {
    const { games, items } = await loadShop();
    updateProduct(games);
    initCatalogue(games);
    initCart(games, items);
  } catch {
    const results = document.querySelector('#results');
    if (results) results.textContent = 'Catálogo indisponível.';
    showError(
      'Não conseguimos carregar a oferta. Confirma que a API está a funcionar e volta a carregar a página.',
    );
  }
}
void initShop();
