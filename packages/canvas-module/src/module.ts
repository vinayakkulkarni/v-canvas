import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';
import { defu } from 'defu';

const NAME = 'nuxt-canvas' as const;

export type ModuleOptions = Record<string, unknown>;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey: NAME,
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(NAME);
    const { resolve } = createResolver(import.meta.url);

    logger.info(`Adding ${NAME} module...`, userOptions);
    // 1. Set up runtime configuration
    const options = defu(
      nuxt.options.runtimeConfig.public[NAME],
      userOptions,
      {},
    );
    nuxt.options.runtimeConfig.public[NAME] = options;

    // 3. Add composables
    addImports([
      {
        name: 'useCanvas',
        from: resolve('./runtime/composables/useCanvas'),
      },
    ]);

    // 4. Add types
    const filename = `types/${NAME}.d.ts`;

    nuxt.hook('prepare:types', (options) => {
      options.references.push({
        path: resolve(nuxt.options.buildDir, filename),
      });
    });

    // 5. Add plugin & middleware
    addPlugin({
      src: resolve('runtime/plugin'),
      mode: 'client',
    });

    logger.success(`Added ${NAME} module successfully.`);
  },
});
