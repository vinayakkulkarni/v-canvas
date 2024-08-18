import { CanvasClient } from '@dscvr-one/canvas-client-sdk';
import { ref } from 'vue';
import type { CanvasInterface } from '@dscvr-one/canvas-client-sdk';
import type { Ref } from 'vue';

export type CanvasStore = {
  client: Ref<CanvasClient | null>;
  user: Ref<CanvasInterface.Lifecycle.User | null>;
  content: Ref<CanvasInterface.Lifecycle.Content | null>;
  isReady: Ref<boolean>;
  initializeCanvas: () => Promise<void>;
  cleanupCanvas: () => void;
};

const validateHostMessage = async (
  _message: CanvasInterface.Lifecycle.InitResponse,
): Promise<boolean> => {
  // Implement your validation logic here
  return true; // Placeholder return
};

export const createCanvasStore = (): CanvasStore => {
  const client = ref<CanvasClient | null>(null);
  const user = ref<CanvasInterface.Lifecycle.User | null>(null);
  const content = ref<CanvasInterface.Lifecycle.Content | null>(null);
  const isReady = ref(false);

  const initializeCanvas = async () => {
    if (client.value) return;

    const newClient = new CanvasClient();

    try {
      const response = await newClient.ready();
      const isValidResponse = await validateHostMessage(response);
      if (isValidResponse) {
        client.value = newClient;
        user.value = response.untrusted.user!;
        content.value = response.untrusted.content!;
        isReady.value = true;
      }
    } catch {
      isReady.value = true;
    }
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
    client: client as Ref<CanvasClient | null>,
    user,
    content,
    isReady,
    initializeCanvas,
    cleanupCanvas,
  };
};
