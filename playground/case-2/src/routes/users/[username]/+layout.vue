<template>
  <fieldset>
    <legend>/users/[username]/+layout.vue</legend>
    <h2>User {{ $route.params.username }}</h2>
    <RouterView />
  </fieldset>
</template>
