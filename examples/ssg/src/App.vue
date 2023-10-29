<script lang="ts" setup>
import { useHead } from '@unhead/vue';

useHead({
  title: 'Vite | Next Generation Frontend Tooling',
  meta: [
    {
      name: 'description',
      content: 'Next Generation Frontend Tooling',
    },
    {
      name: 'theme-color',
      content: '#646cff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: 'https://vitejs.dev/logo.svg',
    },
  ],
});
</script>

<template>
  <fieldset>
    <legend>App.vue</legend>
    <RouterView />
  </fieldset>
</template>
