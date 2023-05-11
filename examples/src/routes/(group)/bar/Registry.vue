<script lang="ts" setup>
defineRegistry({
  middleware: ['foo'],
});
</script>

<template>
  <h1>/(group)/bar -> /bar</h1>
  <h2>{ middleware: ['foo'] }</h2>
</template>
