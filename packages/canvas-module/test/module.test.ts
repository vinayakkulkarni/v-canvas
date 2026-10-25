import { describe, expect, it } from 'vite-plus/test';
import canvasModule from '../src/module';

describe('canvas module', () => {
  it('registers under the nuxt-canvas config key for Nuxt 4', async () => {
    const meta = await canvasModule.getMeta?.();
    expect(meta).toMatchObject({
      name: 'nuxt-canvas',
      configKey: 'nuxt-canvas',
      compatibility: { nuxt: '>=4.0.0' },
    });
  });
});
