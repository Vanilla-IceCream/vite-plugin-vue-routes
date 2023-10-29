<template>
  <fieldset>
    <legend>App.vue</legend>

    <ul>
      <li><RouterLink to="/">Home</RouterLink></li>
      <li><RouterLink to="/about">/(home)</RouterLink></li>
      <li></li>
      <li><RouterLink to="/foo/bar/baz">404</RouterLink></li>
    </ul>

    <RouterView />
  </fieldset>
</template>
