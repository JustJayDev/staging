import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// JustJayDev — main website.
// Static output for GitHub Pages. `base: '/'` is deliberate and load-bearing:
// relative asset URLs resolve against the *current route*, so with a relative
// base a deep link like /games/dragon-city would request /games/assets/*.js and
// /games/logo.svg, and 404. Absolute base pins every asset to the origin root.
export default defineConfig({
  site: 'https://justjaydev.github.io',
  base: '/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Fail the build rather than silently shipping an oversized page.
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});