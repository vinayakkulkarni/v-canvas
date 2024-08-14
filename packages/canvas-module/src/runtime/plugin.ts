import { defineNuxtPlugin } from '#imports';
import { createCanvasStore } from '@vinayakkulkarni/canvas-client';
import type { CanvasStore } from '@vinayakkulkarni/canvas-client';

export default defineNuxtPlugin(() => {
  const canvasStore = createCanvasStore();

  return {
    provide: {
      canvas: canvasStore,
    },
  };
});

// Add type augmentation for Nuxt app
declare module '#app' {
  interface NuxtApp {
    $canvas: CanvasStore;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $canvas: CanvasStore;
  }
}
