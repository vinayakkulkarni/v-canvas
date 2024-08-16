import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind,
  presetUno,
  transformerDirectives,
} from 'unocss';

const defaultSans = [
  'ui-sans-serif',
  'system-ui',
  '-apple-system',
  'BlinkMacSystemFont',
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  'Arial',
  'Noto Sans',
  'sans-serif',
  'Apple Color Emoji',
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Noto Color Emoji',
];

export default defineConfig({
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        // include js/ts files
        '**/*.{js,ts}',
      ],
      // exclude files
      // exclude: []
    },
  },
  theme: {
    fontFamily: {
      sans: ['Inter var', 'Inter', ...defaultSans],
    },
  },
  presets: [
    presetUno(),
    presetWind({ dark: 'class' }),
    presetAttributify(),
    presetIcons(),
    presetTypography(),
  ],
  transformers: [transformerDirectives()],
});
