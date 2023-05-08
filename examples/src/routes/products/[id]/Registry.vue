<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <div>/products/{{ route.params.id }}</div>
</template>
