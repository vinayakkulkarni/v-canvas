import { defineConfig } from 'vite-plus';

const ignorePatterns = [
  '.nuxt',
  '.output',
  'dist',
  'node_modules',
  '.wrangler',
  'coverage',
  '*.min.js',
  '*.min.css',
];

// Root config: lint and format for the whole monorepo. Each package keeps its
// own vite.config.ts for `vp pack` and `vp test`.
export default defineConfig({
  lint: {
    plugins: ['typescript', 'vue', 'import'],
    ignorePatterns,
  },
  fmt: {
    printWidth: 80,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    bracketSpacing: true,
    arrowParens: 'always',
    endOfLine: 'lf',
    vueIndentScriptAndStyle: true,
    ignorePatterns: [...ignorePatterns, 'pnpm-lock.yaml', '**/CHANGELOG.md'],
  },
});
