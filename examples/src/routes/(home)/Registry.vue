<script lang="ts" setup>
defineRegistry({
  layout: 'Default',
  middleware: ['foo', 'bar'],
});
</script>

<template>
  <h1>/(home) -> /</h1>
  <h2>{ layout: 'Default', middleware: ['foo', 'bar'] }</h2>
</template>
