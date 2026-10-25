import { createCanvasStore } from '@vinayakkulkarni/canvas-store';
import type { CanvasStore } from '@vinayakkulkarni/canvas-store';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  const canvasStore = createCanvasStore();

  nuxtApp.hook('app:mounted', () => {
    // initializeCanvas() is idempotent and settles on its own outside a host.
    void canvasStore.initializeCanvas();
  });

  return {
    provide: {
      canvas: canvasStore,
    },
  };
});

// Typed here, next to the injection, so `useNuxtApp().$canvas` and
// `this.$canvas` are typed in the module and in every app that installs it.
declare module '#app' {
  interface NuxtApp {
    $canvas: CanvasStore;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $canvas: CanvasStore;
  }
}
