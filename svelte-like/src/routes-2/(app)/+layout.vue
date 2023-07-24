<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <fieldset>
    <legend>/(app)/+layout.vue</legend>

    <ul>
      <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
      <li><RouterLink to="/admin">Admin</RouterLink></li>
    </ul>

    <RouterView />
  </fieldset>
</template>
