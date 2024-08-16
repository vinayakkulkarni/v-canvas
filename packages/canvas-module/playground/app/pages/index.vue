<script setup lang="ts">
  const { client, user, isReady, initializeCanvas, cleanupCanvas } =
    useCanvas();

  const resizeObserver = ref<ResizeObserver | null>(null);

  onBeforeMount(async () => {
    await initializeCanvas();
  });

  onMounted(async () => {
    if (client.value) {
      resizeObserver.value = new ResizeObserver(() => client.value?.resize());
      resizeObserver.value.observe(document.body);
    }
  });

  onUnmounted(() => {
    if (resizeObserver.value) {
      resizeObserver.value.disconnect();
    }
    cleanupCanvas();
  });

  const openUserProfile = () => {
    if (!client.value || !user.value) return;
    const url = `https://dscvr.one/u/${user.value.username}`;
    client.value.openLink(url);
  };
  const setBodyHeight = (height: number) => {
    document.body.style.height = height ? `${height}px` : '';
  };
</script>

<template>
  <div v-if="isReady">
    <div class="grid grid-cols-1 gap-3 p-4">
      <template v-if="user">
        <user-info :user="user" @open="openUserProfile" />
      </template>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <button
          v-for="height in [1000, 1500, 0]"
          :key="height"
          type="button"
          class="px-4 py-2 font-bold text-white bg-gray-500 rounded hover:bg-gray-400 hover:border-gray-500"
          @click="setBodyHeight(height)"
        >
          {{ height ? `Set height to ${height}px` : 'Reset height' }}
        </button>
      </div>
    </div>
  </div>
  <div
    v-else
    class="flex flex-col items-center justify-center w-dvw h-dvh gap-y-4"
  >
    <svg
      class="text-white animate-spin size-12"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    Loading canvas...
  </div>
</template>
