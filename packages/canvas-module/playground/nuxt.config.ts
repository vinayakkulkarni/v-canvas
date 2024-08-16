// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt Module | Playground',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          charset: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          property: 'dscvr:canvas:version',
          content: 'vNext',
        },
      ],
    },
  },
  compatibilityDate: '2024-04-03',
  css: ['~/assets/css/global.css'],
  devtools: { enabled: true },
  experimental: {
    renderJsonPayloads: true,
  },
  future: { compatibilityVersion: 4 },
  modules: [
    // https://unocss.dev/integrations/nuxt
    '@unocss/nuxt',
    // https://nuxt.com/modules/fontaine
    '@nuxtjs/fontaine',
    // Local module(s)
    '../src/module',
    // '@vinayakkulkarni/canvas-module',
  ],
});
