<script lang="ts" setup>
defineRegistry({
  middleware: ['bar'],
});
</script>

<template>
  <h1>/(group)/bar -> /bar</h1>
  <h2>{ middleware: ['bar'] }</h2>
</template>
