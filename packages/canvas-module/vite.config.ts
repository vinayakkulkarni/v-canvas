import { defineConfig } from 'vite-plus';

// vite-plus drives the unit tests only (`vp test`). nuxt-module-build owns the
// module build.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
  },
});
