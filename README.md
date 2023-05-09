# vite-plugin-vue-routes

File system based routing for Vue applications using Vite.

## Installation

Install `vite-plugin-vue-routes` with your favorite package manager:

```sh
$ npm i vite-plugin-vue-routes -D
# or
$ yarn add vite-plugin-vue-routes -D
# or
$ pnpm i vite-plugin-vue-routes -D
# or
$ bun add vite-plugin-vue-routes -D
```

## Usage

### Configure Vite

Configure Vite by creating a `vite.config.ts` file in the root directory of your project, as shown below:

```ts
// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueRoutes from 'vite-plugin-vue-routes';

export default defineConfig({
  plugins: [vue(), vueRoutes()],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
});
```

### Create the Vue Application

Create a Vue application by defining `src/App.vue`:

```vue
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
```

```ts
// src/main.ts
import { createApp } from 'vue';

import router from '~/plugins/router';

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#root');
```

### Create the Router Plugin

Create the router plugin by defining `src/plugins/router.ts`:

```ts
// src/plugins/router.ts
import { createWebHistory, createRouter } from 'vue-router';

import routes from 'virtual:vue-routes';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes(),

    {
      path: '/:pathMatch(.*)*',
      component: () => import('~/Error.vue'),
      meta: { layout: 'empty' },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { top: 0 };
  },
});

export default router;
```

```ts
// shims.d.ts
declare module 'virtual:vue-routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: () => RouteRecordRaw[];
  export default routes;
}
```

### Define Routes

Define routes by creating files in the `src/routes` directory:

```
src/routes/path/to/Registry.vue
```

### Route File Naming Convention

The file naming convention for the routes is as follows:

```coffee
src/routes/hello-world/Registry.vue -> /hello-world

src/routes/products/Registry.vue -> /products
src/routes/products/[id]/Registry.vue -> /products/:id

src/routes/posts/[[title]]/Registry.vue -> /posts/:title?

src/routes/blog/[...info]/Registry.vue -> /blog/:info*

src/routes/(group)/foo/Registry.vue -> /foo
src/routes/(group)/bar/Registry.vue -> /bar

src/routes/(home)/Registry.vue -> /
```

## Macros

The `defineRegistry` macro helps you quickly use layouts and middleware within `Registry.vue`.

```vue
<script lang="ts" setup>
defineRegistry({
  // ...
});
</script>
```

```ts
// shims.d.ts
interface RegistryOptions {
  layout?: string;
  middleware?: string[];
}

declare function defineRegistry(options?: RegistryOptions): void;
```

### Layouts

If you want to use `layouts/Default.vue`, you can do so without using `defineRegistry`.

```vue
<!-- src/routes/path/to/Registry.vue -->
<script lang="ts" setup>
defineRegistry({
  layout: 'default',
  // 'default' -> src/layouts/Default.vue
  // 'foo' -> src/layouts/Foo.vue
  // 'fooBar' -> src/layouts/FooBar.vue
});
</script>

<template>
  <div>Content</div>
</template>
```

```vue
<!-- src/layouts/Default.vue -->
<template>
  <div class="p-4">
    <slot></slot>
  </div>
</template>
```

### Middleware

```vue
<!-- src/routes/path/to/Registry.vue -->
<script lang="ts" setup>
defineRegistry({
  middleware: ['auth'],
});
</script>
```

```ts
// src/middleware/auth.ts
export default (to, from) => {
  if (!localStorage.getItem('accessToken')) {
    return { path: '/login' };
  }

  return true;
};
```
