// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://jhashanknayanportfolio.netlify.app/',
  compressHTML: true,
  integrations: [sitemap()],
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
