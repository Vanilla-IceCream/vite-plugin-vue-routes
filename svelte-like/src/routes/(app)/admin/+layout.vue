<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <fieldset>
    <legend>/(app)/admin/+layout.vue</legend>

    <ul>
      <li><RouterLink to="/admin">Admin</RouterLink></li>
      <li><RouterLink to="/admin/theme">Theme</RouterLink></li>
    </ul>

    <RouterView />
  </fieldset>
</template>
