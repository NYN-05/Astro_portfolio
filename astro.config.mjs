// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://portfolio.placeholder',
  compressHTML: true,
  integrations: [],
  build: {
    inlineStylesheets: 'never',
  },
  security: {
    checkOrigin: true,
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});