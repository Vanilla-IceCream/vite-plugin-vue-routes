<script lang="ts" setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <fieldset>
    <legend>/+error.vue -> /:slug(.*)*</legend>

    <div>
      route.params:
      <pre>{{ route.params }}</pre>
    </div>
  </fieldset>
</template>
