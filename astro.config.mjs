import { defineConfig } from 'astro/config';

const proxy = {
  '/api': { target: 'http://127.0.0.1:3001', rewrite: (path) => path.replace(/^\/api/, '') },
};
export default defineConfig({ vite: { server: { proxy }, preview: { proxy } } });
