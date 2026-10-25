import {
  addImports,
  addPlugin,
  createResolver,
  defineNuxtModule,
  useLogger,
} from '@nuxt/kit';
import { defu } from 'defu';

const NAME = 'nuxt-canvas';

export type ModuleOptions = Record<string, unknown>;

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: NAME,
    configKey: NAME,
    compatibility: { nuxt: '>=4.0.0' },
  },
  setup(userOptions, nuxt) {
    const logger = useLogger(NAME);
    const { resolve } = createResolver(import.meta.url);

    // Expose the options on the public runtime config.
    nuxt.options.runtimeConfig.public[NAME] = defu(
      nuxt.options.runtimeConfig.public[NAME],
      userOptions,
    );

    addImports({
      name: 'useCanvas',
      from: resolve('./runtime/composables/useCanvas'),
    });

    // Both sides: useCanvas() works during SSR (empty, not ready); the SDK
    // client itself starts on `app:mounted`, in the browser only.
    addPlugin(resolve('./runtime/plugin'));

    logger.success(`Added ${NAME} module.`);
  },
});
