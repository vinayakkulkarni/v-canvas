import { beforeEach, describe, expect, it, vi } from 'vite-plus/test';

const sdk = vi.hoisted(() => {
  const ready = vi.fn();
  const destroy = vi.fn();
  const construct = vi.fn();
  class CanvasClient {
    ready = ready;
    destroy = destroy;
    constructor() {
      construct();
    }
  }
  return {
    ready,
    destroy,
    construct,
    CanvasClient,
    isIframeContext: vi.fn(() => true),
  };
});

vi.mock('@dscvr-one/canvas-client-sdk/dist/index.js', () => ({
  CanvasClient: sdk.CanvasClient,
  isIframeContext: sdk.isIframeContext,
}));

const { createCanvasStore } = await import('../src/index');

const user = { id: 'u1', username: 'vinayak', avatar: 'https://a/b.png' };
const content = { id: 'c1', portalId: 'p1', portalName: 'vue' };

describe('createCanvasStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sdk.isIframeContext.mockReturnValue(true);
    sdk.ready.mockResolvedValue({
      type: 'lifecycle:init-response',
      trustedBytes: '',
      untrusted: { user, content },
    });
  });

  it('starts empty and not ready', () => {
    const store = createCanvasStore();
    expect(store.client.value).toBeNull();
    expect(store.user.value).toBeNull();
    expect(store.content.value).toBeNull();
    expect(store.isReady.value).toBe(false);
  });

  it('stores the user and content the host sends', async () => {
    const store = createCanvasStore();
    await store.initializeCanvas();
    expect(store.client.value).toBeInstanceOf(sdk.CanvasClient);
    expect(store.user.value).toEqual(user);
    expect(store.content.value).toEqual(content);
    expect(store.isReady.value).toBe(true);
  });

  it('keeps user and content null when the host omits them', async () => {
    sdk.ready.mockResolvedValue({
      type: 'lifecycle:init-response',
      trustedBytes: '',
      untrusted: {},
    });
    const store = createCanvasStore();
    await store.initializeCanvas();
    expect(store.user.value).toBeNull();
    expect(store.content.value).toBeNull();
    expect(store.isReady.value).toBe(true);
  });

  it('initialises once', async () => {
    const store = createCanvasStore();
    await store.initializeCanvas();
    await store.initializeCanvas();
    expect(sdk.construct).toHaveBeenCalledTimes(1);
  });

  it('settles at once outside an iframe without creating a client', async () => {
    sdk.isIframeContext.mockReturnValue(false);
    const store = createCanvasStore();
    await store.initializeCanvas();
    expect(sdk.construct).not.toHaveBeenCalled();
    expect(store.client.value).toBeNull();
    expect(store.isReady.value).toBe(true);
  });

  it('settles without a client when the SDK throws', async () => {
    sdk.construct.mockImplementationOnce(() => {
      throw new Error('ReferrerNotDefinedError');
    });
    const store = createCanvasStore();
    await store.initializeCanvas();
    expect(store.client.value).toBeNull();
    expect(store.isReady.value).toBe(true);
  });

  it('cleans up: destroys the client and resets state', async () => {
    const store = createCanvasStore();
    await store.initializeCanvas();
    store.cleanupCanvas();
    expect(sdk.destroy).toHaveBeenCalledTimes(1);
    expect(store.client.value).toBeNull();
    expect(store.user.value).toBeNull();
    expect(store.content.value).toBeNull();
    expect(store.isReady.value).toBe(false);
  });
});
