import { copyFile } from 'node:fs/promises';
await copyFile(new URL('../data/seed.json', import.meta.url), new URL('../data/db.json', import.meta.url));
console.log('Catálogo reposto e carrinho esvaziado.');
