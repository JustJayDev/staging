import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Staging build only. The production site is served from the domain root, so
// its base stays '/' (see astro.config.mjs). This repo is published under
// /staging/, so every absolute asset URL has to be prefixed with that path or
// the stylesheet 404s.
export default defineConfig({
  site: 'https://justjaydev.github.io',
  base: '/staging/',
  output: 'static',
  trailingSlash: 'never',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});