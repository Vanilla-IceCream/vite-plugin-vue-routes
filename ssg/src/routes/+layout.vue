<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <fieldset>
    <legend>/+layout.vue</legend>

    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">About</RouterLink></li>
      <li><RouterLink to="/admin">Admin</RouterLink></li>
      <li><RouterLink to="/dashboard">Dashboard</RouterLink></li>
      <li></li>
      <li><RouterLink to="/foobarbaz">404</RouterLink></li>
    </ul>

    <RouterView />
  </fieldset>
</template>
