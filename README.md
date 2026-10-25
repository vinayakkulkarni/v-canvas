# v-canvas

DSCVR Canvas for Vue 3 and Nuxt 4: a reactive store around the
[canvas client SDK](https://github.com/dscvr-one/dscvr-canvas) and a Nuxt
module that installs it.

**Demo:** [v-canvas.vinayakkulkarni.dev](https://v-canvas.vinayakkulkarni.dev) —
the module runs in a frame against a simulated DSCVR host, and every SDK
message shows on the page.

| Package                                                    | What it is                                     |
| ---------------------------------------------------------- | ---------------------------------------------- |
| [`@vinayakkulkarni/canvas-module`](packages/canvas-module) | Nuxt module: auto-imports `useCanvas()`        |
| [`@vinayakkulkarni/canvas-store`](packages/canvas-store)   | Vue store: `createCanvasStore()` for any Vue 3 |

## Nuxt

```sh
pnpm add @vinayakkulkarni/canvas-module
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vinayakkulkarni/canvas-module'],
});
```

```vue
<script setup lang="ts">
  const { client, user, content, isReady } = useCanvas();

  function openProfile() {
    client.value?.openLink(`https://dscvr.one/u/${user.value?.username}`);
  }
</script>
```

The module starts the host handshake on `app:mounted`. Outside a DSCVR host
frame, `isReady` turns `true` at once and `client` stays `null`.

## Vue

```sh
pnpm add @vinayakkulkarni/canvas-store
```

```ts
import { createCanvasStore } from '@vinayakkulkarni/canvas-store';

const canvas = createCanvasStore();
await canvas.initializeCanvas();
canvas.user.value; // { id, username, avatar? } | null
```

| Member               | Type                        | Notes                                    |
| -------------------- | --------------------------- | ---------------------------------------- |
| `client`             | `Ref<CanvasClient \| null>` | The SDK client once the host answered.   |
| `user`               | `Ref<User \| null>`         | The DSCVR user viewing the post, if any. |
| `content`            | `Ref<Content \| null>`      | The post and portal the canvas lives in. |
| `isReady`            | `Ref<boolean>`              | `true` once the handshake settled.       |
| `initializeCanvas()` | `Promise<void>`             | Handshake with the host. Idempotent.     |
| `cleanupCanvas()`    | `void`                      | Destroy the client and reset the state.  |

## Development

Node 26 and pnpm (see `devEngines` and `packageManager` in `package.json`).

```sh
pnpm install
pnpm run dev:demo      # the demo, with the module and store loaded from source
pnpm run lint          # vp lint
pnpm run format:check  # vp fmt --check
pnpm run typecheck
pnpm run test
pnpm run build         # both packages
pnpm run deploy        # build the demo and deploy it to Cloudflare Workers
```

## License

MIT © [Vinayak Kulkarni](https://vinayakkulkarni.dev)
