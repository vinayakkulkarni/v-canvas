import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  useLogger,
} from '@nuxt/kit';
import { fileURLToPath } from 'url';

const NAME = 'nuxt-canvas';

export default defineNuxtModule({
  meta: {
    name: NAME,
    configKey: 'canvas',
  },
  setup(_userOptions, nuxt) {
    const logger = useLogger(NAME);
    logger.info(`Adding ${NAME} module...`, _userOptions);

    const { resolve } = createResolver(import.meta.url);
    const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

    // 1. Add plugin & middleware
    addPlugin(resolve(runtimeDir, 'plugin'));

    // 2. Add composables
    addImports([
      {
        name: 'useCanvas',
        as: 'useCanvas',
        from: resolve('./runtime/composables/use-canvas'),
      },
    ]);

    // 3. Add runtime dir for transpilation
    nuxt.options.build.transpile.push(runtimeDir);

    logger.success(`Added ${NAME} module successfully.`);
  },
});
