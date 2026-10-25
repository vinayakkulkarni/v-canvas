<script setup lang="ts">
  // The canvas app. It knows nothing about the simulator: it only uses the
  // module's useCanvas(), exactly as an app inside a real DSCVR post would.
  useHead({
    title: 'v-canvas — canvas app',
    meta: [
      { property: 'dscvr:canvas:version', content: 'vNext' },
      { name: 'robots', content: 'noindex' },
    ],
  });

  const { client, user, content, isReady } = useCanvas();

  const root = useTemplateRef<HTMLElement>('root');
  const notes = ref<string[]>([]);
  const copyResult = ref<string | null>(null);
  let observer: ResizeObserver | null = null;

  // Ask the host to fit the frame to the content whenever it changes size.
  watch(
    [client, root],
    ([current, el]) => {
      observer?.disconnect();
      observer = null;
      if (!current || !el) return;
      observer = new ResizeObserver(() => {
        current.resize({
          width: el.offsetWidth,
          height: Math.ceil(el.getBoundingClientRect().height),
        });
      });
      observer.observe(el);
    },
    { flush: 'post' },
  );

  onBeforeUnmount(() => observer?.disconnect());

  const initials = computed(() =>
    (user.value?.username ?? '?').slice(0, 2).toUpperCase(),
  );

  function openProfile() {
    if (!client.value || !user.value) return;
    client.value.openLink(`https://dscvr.one/u/${user.value.username}`);
  }

  async function copyPostId() {
    if (!client.value || !content.value) return;
    const response = await client.value.copyToClipboard(content.value.id);
    copyResult.value = response.untrusted.success
      ? `copied ${content.value.id}`
      : 'the host refused the copy';
  }

  function addNote() {
    notes.value = [
      ...notes.value,
      `note ${notes.value.length + 1} — the frame grows to fit`,
    ];
  }

  function clearNotes() {
    notes.value = [];
  }
</script>

<template>
  <div ref="root" class="bg-paper p-5 text-ink">
    <p v-if="!isReady" class="font-mono text-xs text-ink-3" aria-live="polite">
      handshake: waiting for the host…
    </p>

    <div v-else-if="!client" class="grid gap-3">
      <p class="font-mono text-xs text-accent-ink">no host</p>
      <p class="max-w-[48ch] leading-relaxed text-ink-2">
        This page is the canvas app. It needs a host frame to talk to. Open the
        <NuxtLink
          to="/"
          class="underline decoration-rule underline-offset-4 hover:decoration-ink-3"
          >simulator</NuxtLink
        >
        to run it inside one.
      </p>
    </div>

    <div v-else class="grid gap-5">
      <p class="font-mono text-xs text-accent-ink" aria-live="polite">
        connected · {{ content?.portalName ?? 'no portal' }} ·
        {{ content?.id ?? 'no post' }}
      </p>

      <div class="flex items-center gap-4">
        <span
          class="grid size-14 shrink-0 place-items-center bg-ink font-display text-lg text-paper"
          aria-hidden="true"
          >{{ initials }}</span
        >
        <div class="min-w-0">
          <p class="truncate font-display text-2xl leading-tight font-semibold">
            {{ user ? `@${user.username}` : 'signed out' }}
          </p>
          <p class="truncate font-mono text-xs text-ink-3">
            {{ user ? user.id : 'the host sent no user' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="h-9 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="!user"
          @click="openProfile"
        >
          openLink(profile)
        </button>
        <button
          type="button"
          class="h-9 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          @click="copyPostId"
        >
          copyToClipboard(post id)
        </button>
        <button
          type="button"
          class="h-9 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          @click="addNote"
        >
          add a note
        </button>
        <button
          v-if="notes.length > 0"
          type="button"
          class="h-9 border border-rule px-3 font-mono text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
          @click="clearNotes"
        >
          clear notes
        </button>
      </div>

      <p
        v-if="copyResult"
        class="font-mono text-xs text-ink-3"
        aria-live="polite"
      >
        {{ copyResult }}
      </p>

      <ol v-if="notes.length > 0" class="grid gap-2" role="list">
        <li
          v-for="note in notes"
          :key="note"
          class="border-t border-rule pt-2 text-sm text-ink-2"
        >
          {{ note }}
        </li>
      </ol>
    </div>
  </div>
</template>
