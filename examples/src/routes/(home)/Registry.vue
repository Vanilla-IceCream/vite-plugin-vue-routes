<script lang="ts" setup>
defineRegistry({
  layout: 'default',
  middleware: ['foo', 'bar'],
});
</script>

<template>
  <h1>/(home) -> /</h1>
  <h2>{ layout: 'default', middleware: ['foo', 'bar'] }</h2>
</template>
