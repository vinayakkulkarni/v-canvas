<script setup lang="ts">
  const props = defineProps<{
    user: {
      id: string;
      username: string;
      avatar?: string;
    };
  }>();

  const user = toRef(props, 'user');

  const emit = defineEmits<{
    (e: 'open'): void;
  }>();
</script>

<template>
  <a
    v-if="user"
    class="flex gap-4 group hover:text-indigo-400 hover:cursor-pointer"
    @click="emit('open')"
  >
    <img :src="user.avatar" alt="User Avatar" class="size-20 rounded-full" />
    <div class="flex flex-col gap-1">
      <h1 class="text-lg font-bold">User Info</h1>
      <p>
        <b>User ID: </b>
        <span class="text-gray-300 group-hover:text-indigo-300">
          {{ user.id }}
        </span>
      </p>
      <p>
        <b>User Name: </b>
        <span class="text-gray-300 group-hover:text-indigo-300">
          {{ user.username }}
        </span>
      </p>
    </div>
  </a>
</template>
