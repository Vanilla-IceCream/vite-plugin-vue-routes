<script lang="ts" setup>
import Layout from 'virtual:vue-routes/Layout.vue';
</script>

<template>
  <ul>
    <li><RouterLink to="/hello-world">/hello-world</RouterLink></li>
    <li></li>
    <li><RouterLink to="/products">/products</RouterLink></li>
    <li><RouterLink to="/products/123">/products/[id] - /products/123</RouterLink></li>
    <li></li>
    <li><RouterLink to="/posts">/posts/[[title]] - /posts</RouterLink></li>
    <li><RouterLink to="/posts/vue-routes">/posts/[[title]] - /posts/vue-routes</RouterLink></li>
    <li></li>
    <li><RouterLink to="/blog/vue/routes">/blog/[...info] - /blog/vue/routes</RouterLink></li>
    <li></li>
    <li><RouterLink to="/foo">/(group)/foo</RouterLink></li>
    <li><RouterLink to="/bar">/(group)/bar</RouterLink></li>
    <li></li>
    <li><RouterLink to="/">/(home)</RouterLink></li>
    <li></li>
    <li><RouterLink to="/dashboard">/dashboard (Layout Level Middleware)</RouterLink></li>
    <li></li>
    <li><RouterLink to="/users/eduardo">/users/eduardo</RouterLink></li>
    <li><RouterLink to="/users/eduardo/profile">/users/eduardo/profile</RouterLink></li>
    <li><RouterLink to="/users/eduardo/posts">/users/eduardo/posts</RouterLink></li>
  </ul>

  <Layout>
    <RouterView />
  </Layout>
</template>
