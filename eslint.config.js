import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import { glob } from 'glob';

// Find all tsconfig.json files in the monorepo
const tsConfigFiles = glob.sync('**/tsconfig.json', {
  ignore: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**'],
});

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    plugins: {
      '@typescript-eslint': typescript,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: tsConfigFiles,
      },
      globals: {
        URL: 'readonly',
      },
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      semi: ['error', 'always'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['packages/canvas-module/build.config.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: null,
      },
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/playground/.nuxt/**',
    ],
  },
];
