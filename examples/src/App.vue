<template>
  <ul>
    <li><RouterLink to="/">Home</RouterLink></li>
    <li><RouterLink to="/hello-world">/hello-world</RouterLink></li>
    <li><RouterLink to="/products">/products</RouterLink></li>
    <li><RouterLink to="/products/123">/products/[id]</RouterLink></li>
    <li><RouterLink to="/blog/title/date">/blog/[...info]</RouterLink></li>
    <li><RouterLink to="/foo">/(group)/foo</RouterLink></li>
    <li><RouterLink to="/bar">/(group)/bar</RouterLink></li>
  </ul>

  <RouterView />
</template>
