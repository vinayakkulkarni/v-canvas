import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
  pack: {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    platform: 'neutral',
    sourcemap: true,
    dts: true,
    deps: {
      neverBundle: ['vue', /^@dscvr-one\//],
    },
  },
});
