import { useNuxtApp } from '#app';
import type { CanvasStore } from '@vinayakkulkarni/canvas-client';

export const useCanvas = (): CanvasStore => {
  const { $canvas } = useNuxtApp();
  return $canvas;
};
