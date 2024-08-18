import { useNuxtApp } from '#app';
import type { CanvasStore } from '@vinayakkulkarni/canvas-store';

export const useCanvas = (): CanvasStore => {
  const { $canvas } = useNuxtApp();

  if (!$canvas) {
    throw new Error('Canvas plugin is not properly initialized');
  }

  return $canvas;
};
