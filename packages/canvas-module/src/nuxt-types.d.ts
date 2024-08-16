import type { ModuleOptions } from './module';
import type { CanvasStore } from '@vinayakkulkarni/canvas-client';

declare module '@nuxt/schema' {
  interface RuntimeConfig {
    ['nuxt-canvas']: ModuleOptions;
  }
  interface PublicRuntimeConfig {
    ['nuxt-canvas']: ModuleOptions;
  }
}

// Add type augmentation for Nuxt app
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

export {};
