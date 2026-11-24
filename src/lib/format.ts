export const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
export function formatPrice(price: number): string { return price === 0 ? 'Grátis' : euro.format(price); }
