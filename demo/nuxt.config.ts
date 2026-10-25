import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';

const source = (path: string) =>
  fileURLToPath(new URL(`../packages/${path}`, import.meta.url));

// Cloudflare compatibility date — keep the two copies below in sync.
const COMPATIBILITY_DATE = '2026-10-24';

export default defineNuxtConfig({
  compatibilityDate: COMPATIBILITY_DATE,

  // The demo loads the module and the store from source, so it always runs
  // the code in this checkout — no build step between an edit and the demo.
  modules: ['@nuxtjs/color-mode', source('canvas-module/src/module')],

  alias: {
    '@vinayakkulkarni/canvas-store': source('canvas-store/src/index.ts'),
  },

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // Cookie-backed so the server renders the right class on <html>; the
  // module's inline head script resolves "system" before first paint.
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storage: 'cookie',
    storageKey: 'v-canvas-color-mode',
  },

  // Public IDs ship in the HTML; they are not secrets. Override per env with
  // NUXT_PUBLIC_GTAG_ID etc. An empty gtagId skips GA4 entirely (the GA4
  // property for this host is not created yet).
  runtimeConfig: {
    public: {
      gtagId: 'G-DMDS8G73T7',
      plausibleScriptId: 'pa-fFPr4GxOqzb1z7hUlAcug',
      plausibleApiHost: 'https://analytics.geoql.in',
      openpanelClientId: 'c86edb03-2ba9-4763-8c8c-2bb7bc5ed340',
      openpanelApiUrl: 'https://events.geoql.in/api',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'v-canvas — DSCVR Canvas for Vue and Nuxt',
      meta: [
        {
          name: 'description',
          content:
            'A Vue store and a Nuxt module for DSCVR Canvas apps. Run a canvas app against a simulated host and watch every SDK message on the wire.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'preload',
          href: '/fonts/clash-display-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/satoshi-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
    },
  },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      nodeCompat: true,
      deployConfig: true,
      // Merged into the generated .output/server/wrangler.json.
      wrangler: {
        name: 'v-canvas-demo',
        account_id: 'bd11b1c42ee2759044a1769f80f704dd',
        compatibility_date: COMPATIBILITY_DATE,
        workers_dev: true,
        preview_urls: false,
        routes: [
          {
            pattern: 'v-canvas.vinayakkulkarni.dev',
            custom_domain: true,
          },
        ],
        observability: { enabled: true },
      },
    },
  },

  typescript: {
    strict: true,
  },
});
