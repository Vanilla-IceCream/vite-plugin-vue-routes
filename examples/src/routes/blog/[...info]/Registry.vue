<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>/blog/[...info]</div>
  <div>{{ route.params }}</div>
</template>
