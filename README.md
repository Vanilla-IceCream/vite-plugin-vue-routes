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

#### Type

```diff
// tsconfig.json
  "types": [
    // ...
+   "vite-plugin-vue-routes/client",
  ],
```

or

```ts
// vite-env.d.ts
/// <reference types="vite-plugin-vue-routes/client" />
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

### Layouts

To enable the default layout, add a `~/layouts/Default.vue` file.

```vue
<!-- src/layouts/Default.vue -->
<template>
  <div class="p-4">
    <slot></slot>
  </div>
</template>
```

If `layouts/Default.vue` exists, `Registry.vue` will automatically utilize it.

```vue
<!-- src/routes/path/to/Registry.vue -->
<template>
  <div>Automatically use `layouts/Default.vue`.</div>
</template>
```

By using the `layout` attribute, you can specify the desired layout.

```vue
<!-- src/routes/path/to/Registry.vue -->
<script lang="ts" setup>
defineRegistry({
  layout: 'foo',
  // 'foo' -> src/layouts/Foo.vue
  // 'fooBar' -> src/layouts/FooBar.vue
  // 'default@embed' -> inherits from src/layouts/Default.vue and uses src/layouts/Embed.vue
});
</script>

<template>
  <div>Content</div>
</template>
```

Please note that currently, the layout will be re-rendered when switching routes.
Therefore, in order to preserve the layout's state, it is necessary to use state management.

As for libraries for state management, you can consider the following options:

- `pinia`
- `vue-storer`
- `createInjectionState` in `@vueuse/shared`

### Middleware

Route middleware are navigation guards that receive the current route and the next route as arguments.

```ts
// src/middleware/foo.ts
import type { NavigationGuard } from 'vue-router';

export default (async (to, from, next) => {
  return true;
}) as NavigationGuard;
```

In the `Registry.vue` file, you can make a reference to this route middleware.

```vue
<!-- src/routes/path/to/Registry.vue -->
<script lang="ts" setup>
defineRegistry({
  middleware: ['foo'],
  // ['foo', 'bar', 'baz'] Serializing, starting with 'foo', then 'bar', and finally 'baz'.
});
</script>
```

Please note that inline middleware is currently not supported.

#### Layout Level Middleware

When Layout and Middleware have the same name regardless of case sensitivity, Layout will automatically use that Middleware.

```coffee
src/layouts/Foo.vue
src/middleware/foo.ts
```

```vue
<!-- src/routes/path/to/Registry.vue -->
<script lang="ts" setup>
defineRegistry({
  layout: 'foo',
});
</script>
```

You can also give it to `layouts/Default.vue`.

```coffee
src/layouts/Default.vue
src/middleware/default.ts
```
