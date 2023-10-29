<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <h1>/blog/[...info] -> /blog/:info*</h1>

  <h2>
    route.params:
    <pre>{{ route.params }}</pre>
  </h2>
</template>
