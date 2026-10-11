// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://jhashanknayanportfolio.netlify.app',
  compressHTML: true,
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
  },
  security: {
    checkOrigin: true,
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});