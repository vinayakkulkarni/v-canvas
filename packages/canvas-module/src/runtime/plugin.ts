import { createCanvasStore } from '@vinayakkulkarni/canvas-store';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
  const canvasStore = createCanvasStore();

  nuxtApp.hook('app:mounted', () => {
    if (!canvasStore.client) {
      canvasStore.initializeCanvas();
    }
  });

  return {
    provide: {
      canvas: canvasStore,
    },
  };
});
