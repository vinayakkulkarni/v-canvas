// canvas-client-sdk@2.0.0 points `main` at `src/index.ts`, which is not in
// the published tarball. The built entry is fine, so import it directly.
import {
  CanvasClient,
  isIframeContext,
} from '@dscvr-one/canvas-client-sdk/dist/index.js';
import type { CanvasInterface } from '@dscvr-one/canvas-client-sdk/dist/index.js';
import { ref, shallowRef } from 'vue';
import type { Ref } from 'vue';

export type CanvasStore = {
  client: Ref<CanvasClient | null>;
  user: Ref<CanvasInterface.Lifecycle.User | null>;
  content: Ref<CanvasInterface.Lifecycle.Content | null>;
  isReady: Ref<boolean>;
  initializeCanvas: () => Promise<void>;
  cleanupCanvas: () => void;
};

export const createCanvasStore = (): CanvasStore => {
  // shallowRef: the SDK client is a class instance with private fields; a
  // deep ref would proxy it and change its type.
  const client = shallowRef<CanvasClient | null>(null);
  const user = ref<CanvasInterface.Lifecycle.User | null>(null);
  const content = ref<CanvasInterface.Lifecycle.Content | null>(null);
  const isReady = ref(false);

  const initializeCanvas = async () => {
    if (client.value) return;

    // Outside a DSCVR host frame the handshake never gets an answer, so
    // settle straight away instead of waiting forever.
    if (!isIframeContext()) {
      isReady.value = true;
      return;
    }

    try {
      // The constructor throws when the frame has no referrer.
      const newClient = new CanvasClient();
      const response = await newClient.ready();
      client.value = newClient;
      user.value = response.untrusted.user ?? null;
      content.value = response.untrusted.content ?? null;
    } catch {
      // No usable host (for example a frame without a referrer): the app
      // still renders, just without a client.
    }
    isReady.value = true;
  };

  const cleanupCanvas = () => {
    if (client.value) {
      client.value.destroy();
      client.value = null;
      user.value = null;
      content.value = null;
      isReady.value = false;
    }
  };

  return {
    client,
    user,
    content,
    isReady,
    initializeCanvas,
    cleanupCanvas,
  };
};
