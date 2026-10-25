// Code samples and the API table for the landing page. Kept out of the SFC:
// a closing script tag inside a template literal would end the SFC block.

const SCRIPT = 'script';

export const MODULE_SNIPPET = `// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vinayakkulkarni/canvas-module'],
});`;

export const PAGE_SNIPPET = `<${SCRIPT} setup lang="ts">
const { client, user, content, isReady } = useCanvas();

function openProfile() {
  client.value?.openLink(\`https://dscvr.one/u/\${user.value?.username}\`);
}
</${SCRIPT}>`;

export const STORE_SNIPPET = `import { createCanvasStore } from '@vinayakkulkarni/canvas-store';

const canvas = createCanvasStore();
await canvas.initializeCanvas(); // settles at once outside a host frame
canvas.user.value; // { id, username, avatar? } | null`;

export const STORE_API = [
  [
    'client',
    'Ref<CanvasClient | null>',
    'The SDK client once the host answered.',
  ],
  ['user', 'Ref<User | null>', 'The DSCVR user viewing the post, if any.'],
  [
    'content',
    'Ref<Content | null>',
    'The post and portal the canvas lives in.',
  ],
  ['isReady', 'Ref<boolean>', 'True once the handshake settled, host or not.'],
  [
    'initializeCanvas()',
    'Promise<void>',
    'Handshake with the host. Idempotent.',
  ],
  ['cleanupCanvas()', 'void', 'Destroy the client and reset the state.'],
] as const;
