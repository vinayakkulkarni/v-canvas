<script setup lang="ts">
  import type { DemoControl } from '~/types/analytics';
  import {
    INITIAL_FRAME_HEIGHT,
    PERSONAS,
    PERSONA_NAMES,
    copyResponse,
    handleClientMessage,
    parseClientMessage,
    type HostMessage,
    type PersonaName,
  } from '~/utils/canvas-host';
  import {
    MODULE_SNIPPET,
    PAGE_SNIPPET,
    STORE_API,
    STORE_SNIPPET,
  } from '~/utils/docs';

  const REPO = 'https://github.com/vinayakkulkarni/v-canvas';
  const NPM_MODULE =
    'https://www.npmjs.com/package/@vinayakkulkarni/canvas-module';
  const NPM_STORE =
    'https://www.npmjs.com/package/@vinayakkulkarni/canvas-store';
  const DSCVR_CANVAS = 'https://github.com/dscvr-one/dscvr-canvas';
  const SITE = 'https://v-canvas.vinayakkulkarni.dev';
  const INSTALL = 'pnpm add @vinayakkulkarni/canvas-module';
  const DESCRIPTION =
    'A Vue store and a Nuxt module for DSCVR Canvas apps. Run a canvas app against a simulated host and watch every SDK message on the wire.';

  useSeoMeta({
    ogType: 'website',
    ogUrl: `${SITE}/`,
    ogTitle: 'v-canvas — DSCVR Canvas for Vue and Nuxt',
    ogDescription: DESCRIPTION,
    twitterCard: 'summary',
  });

  useHead({
    link: [{ rel: 'canonical', href: `${SITE}/` }],
    meta: [
      {
        name: 'theme-color',
        content: '#f8f6f1',
        media: '(prefers-color-scheme: light)',
      },
      {
        name: 'theme-color',
        content: '#14161c',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  });

  const { track } = useAnalytics();
  const colorMode = useColorMode();

  interface WireEntry {
    id: number;
    direction: 'up' | 'down';
    type: string;
    detail: string;
  }

  const MAX_ENTRIES = 40;

  const persona = ref<PersonaName>('ada');
  const reloads = ref(0);
  const frameHeight = ref(INITIAL_FRAME_HEIGHT);
  const frame = useTemplateRef<HTMLIFrameElement>('frame');
  const wire = ref<WireEntry[]>([]);
  let nextId = 0;

  // A new key remounts the iframe: a fresh canvas app, a fresh handshake.
  const frameKey = computed(
    () => `${persona.value}-${colorMode.value}-${reloads.value}`,
  );

  function log(direction: WireEntry['direction'], type: string, detail = '') {
    wire.value = [
      { id: nextId++, direction, type, detail },
      ...wire.value,
    ].slice(0, MAX_ENTRIES);
  }

  function report(control: DemoControl, value: string) {
    track('demo_interaction', { control, value });
  }

  function reply(message: HostMessage) {
    frame.value?.contentWindow?.postMessage(message, window.location.origin);
    log('down', message.type);
  }

  function onMessage(event: MessageEvent) {
    // Only the canvas frame on this page may talk to the host.
    if (event.origin !== window.location.origin) return;
    if (!frame.value || event.source !== frame.value.contentWindow) return;
    const message = parseClientMessage(event.data);
    if (!message) return;

    const action = handleClientMessage(message, PERSONAS[persona.value]);
    report('canvas_message', message.type);

    switch (action.kind) {
      case 'reply':
        log('up', message.type);
        reply(action.message);
        break;
      case 'resize':
        log('up', message.type, `${action.height}px`);
        frameHeight.value = action.height;
        break;
      case 'open-link':
        log('up', message.type, action.url);
        window.open(action.url, '_blank', 'noopener');
        break;
      case 'copy':
        log('up', message.type, action.content);
        navigator.clipboard.writeText(action.content).then(
          () => reply(copyResponse(true)),
          () => reply(copyResponse(false)),
        );
        break;
      case 'note':
        log('up', message.type);
        break;
      case 'unsupported':
        log('up', message.type, 'not simulated');
        break;
    }
  }

  onMounted(() => window.addEventListener('message', onMessage));
  onBeforeUnmount(() => window.removeEventListener('message', onMessage));

  watch(persona, (value) => {
    frameHeight.value = INITIAL_FRAME_HEIGHT;
    report('persona', value);
  });

  function reloadFrame() {
    reloads.value += 1;
    frameHeight.value = INITIAL_FRAME_HEIGHT;
    report('reload_frame', String(reloads.value));
  }

  function clearWire() {
    wire.value = [];
    report('clear_log', 'wire');
  }
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header
      class="flex h-16 shrink-0 items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
    >
      <p class="font-mono text-sm text-ink">
        v-canvas<span class="text-accent">▪</span>
      </p>
      <nav class="flex items-center gap-2" aria-label="Project">
        <OutboundLink
          :href="NPM_MODULE"
          section="header"
          class="inline-flex h-9 items-center border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
        >
          npm
        </OutboundLink>
        <OutboundLink
          :href="REPO"
          section="header"
          class="inline-flex h-9 items-center gap-2 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
        >
          <svg
            class="size-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"
            />
          </svg>
          <span class="hidden sm:inline">GitHub</span>
        </OutboundLink>
        <ThemeToggle />
      </nav>
    </header>

    <main class="flex flex-1 flex-col">
      <section
        aria-labelledby="hero-title"
        class="grid gap-8 px-5 pt-8 pb-12 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12 lg:pt-14"
      >
        <div class="min-w-0 lg:col-span-7">
          <p class="font-mono text-xs text-accent-ink">
            DSCVR Canvas · Vue store + Nuxt module
          </p>
          <h1
            id="hero-title"
            class="mt-5 font-display text-[clamp(2.25rem,6vw,5.25rem)] leading-[1.02] font-semibold tracking-tight text-balance"
          >
            Your Nuxt app, inside a DSCVR post.
          </h1>
        </div>
        <div class="flex min-w-0 flex-col justify-end gap-4 lg:col-span-5">
          <p class="max-w-[46ch] leading-relaxed text-ink-2">
            Add the module and call
            <code class="font-mono text-sm">useCanvas()</code>. It does the host
            handshake and hands you the user, the post and an SDK client. Below,
            the real module runs in a frame against a simulated host, so you can
            watch every message.
          </p>
          <CopyCommand :command="INSTALL" />
        </div>
      </section>

      <section
        aria-labelledby="sim-title"
        class="grid gap-8 border-t border-rule px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12"
      >
        <div class="grid min-w-0 content-start gap-5 lg:col-span-7">
          <div class="flex flex-wrap items-end justify-between gap-4">
            <h2
              id="sim-title"
              class="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] font-semibold tracking-tight"
            >
              Host simulator
            </h2>
            <button
              type="button"
              class="h-9 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
              @click="reloadFrame"
            >
              reload frame
            </button>
          </div>
          <SegmentedControl
            v-model="persona"
            label="host sends user"
            :options="PERSONA_NAMES"
          />
          <figure class="min-w-0 border border-ink">
            <figcaption
              class="flex items-center justify-between gap-3 border-b border-ink bg-ink px-4 py-2 font-mono text-xs text-paper"
            >
              <span class="truncate">dscvr · portal/vue · post-1729</span>
              <span class="shrink-0 tabular-nums">{{ frameHeight }}px</span>
            </figcaption>
            <iframe
              ref="frame"
              :key="frameKey"
              src="/canvas"
              title="Canvas app running against the simulated host"
              class="block w-full bg-paper transition-[height] duration-200"
              :style="{ height: `${frameHeight}px` }"
            />
          </figure>
        </div>

        <div class="flex min-w-0 flex-col gap-4 lg:col-span-5">
          <div class="flex items-center justify-between gap-4">
            <h3 class="font-mono text-xs text-ink-3">
              the wire · {{ wire.length }} messages
            </h3>
            <button
              type="button"
              class="font-mono text-xs text-ink-3 underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3 disabled:opacity-50"
              :disabled="wire.length === 0"
              @click="clearWire"
            >
              clear
            </button>
          </div>
          <ol
            class="max-h-[32rem] min-w-0 overflow-y-auto border-t border-rule"
            role="log"
            aria-live="polite"
            aria-label="Messages between the canvas app and the host"
          >
            <li
              v-for="entry in wire"
              :key="entry.id"
              class="grid grid-cols-[1.5rem_1fr] gap-x-2 border-b border-rule py-2 font-mono text-xs"
            >
              <span
                :class="
                  entry.direction === 'up' ? 'text-accent-ink' : 'text-ink-3'
                "
                :aria-label="
                  entry.direction === 'up' ? 'canvas to host' : 'host to canvas'
                "
                >{{ entry.direction === 'up' ? '↑' : '↓' }}</span
              >
              <span class="min-w-0">
                <span class="block break-all text-ink">{{ entry.type }}</span>
                <span v-if="entry.detail" class="block break-all text-ink-3">{{
                  entry.detail
                }}</span>
              </span>
            </li>
            <li
              v-if="wire.length === 0"
              class="py-3 font-mono text-xs text-ink-3"
            >
              Nothing yet. Reload the frame to replay the handshake.
            </li>
          </ol>
          <p class="text-sm leading-relaxed text-ink-3">
            ↑ canvas to host, ↓ host to canvas. The host here answers the
            handshake, resize, open-link and copy requests. Wallet and post
            requests need the real
            <OutboundLink
              :href="DSCVR_CANVAS"
              section="install"
              class="underline decoration-rule underline-offset-4 hover:decoration-ink-3"
              >DSCVR host</OutboundLink
            >.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="usage-title"
        class="grid gap-8 border-t border-rule px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12"
      >
        <div class="lg:col-span-4">
          <h2
            id="usage-title"
            class="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] font-semibold tracking-tight"
          >
            Two packages
          </h2>
          <p class="mt-4 max-w-[40ch] leading-relaxed text-ink-2">
            <OutboundLink
              :href="NPM_MODULE"
              section="install"
              class="underline decoration-rule underline-offset-4 hover:decoration-ink-3"
              >canvas-module</OutboundLink
            >
            for Nuxt wraps
            <OutboundLink
              :href="NPM_STORE"
              section="install"
              class="underline decoration-rule underline-offset-4 hover:decoration-ink-3"
              >canvas-store</OutboundLink
            >, which works in any Vue 3 app.
          </p>
        </div>
        <div class="grid min-w-0 gap-6 lg:col-span-8">
          <pre
            class="overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-sm text-ink"
          ><code>{{ MODULE_SNIPPET }}</code></pre>
          <pre
            class="overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-sm text-ink"
          ><code>{{ PAGE_SNIPPET }}</code></pre>
          <pre
            class="overflow-x-auto border border-rule bg-paper-2 p-4 font-mono text-sm text-ink"
          ><code>{{ STORE_SNIPPET }}</code></pre>
        </div>
      </section>

      <section
        aria-labelledby="api-title"
        class="grid gap-8 border-t border-rule px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-12"
      >
        <div class="lg:col-span-4">
          <h2
            id="api-title"
            class="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] font-semibold tracking-tight"
          >
            The store
          </h2>
          <p class="mt-4 max-w-[40ch] leading-relaxed text-ink-2">
            <code class="font-mono text-sm">useCanvas()</code> and
            <code class="font-mono text-sm">createCanvasStore()</code> return
            the same object.
          </p>
        </div>
        <dl class="min-w-0 lg:col-span-8">
          <div
            v-for="[name, type, description] in STORE_API"
            :key="name"
            class="grid gap-1 border-t border-rule py-4 sm:grid-cols-[11rem_1fr] sm:gap-6"
          >
            <dt class="font-mono text-sm text-ink">{{ name }}</dt>
            <dd class="min-w-0 text-ink-2">
              <p>{{ description }}</p>
              <p class="mt-1 font-mono text-xs break-words text-ink-3">
                {{ type }}
              </p>
            </dd>
          </div>
        </dl>
      </section>
    </main>

    <footer
      class="flex flex-wrap items-center justify-between gap-4 border-t border-rule px-5 py-6 font-mono text-xs text-ink-3 sm:px-8 lg:px-12"
    >
      <p>MIT · made with Vue by Vinayak Kulkarni</p>
      <OutboundLink
        :href="REPO"
        section="footer"
        class="underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink-3"
      >
        github.com/vinayakkulkarni/v-canvas
      </OutboundLink>
    </footer>
  </div>
</template>
