import { defineConfig } from 'vite';

// The game is plain classic scripts (public/assets.js, public/game.js) on top of three.js from the CDN,
// so Vite only serves and copies them; nothing is bundled yet.
export default defineConfig({
  base: './',
  server: { port: 8790 },
  build: { target: 'es2020' },
});
