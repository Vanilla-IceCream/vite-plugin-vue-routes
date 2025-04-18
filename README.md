# vite-plugin-vue-routes

File-based routing for Vue applications using Vite.

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
  plugins: [
    vue(),
    vueRoutes(), // Default: { routesDir: '<rootDir>/src/routes' }
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

### Create the Vue Application

Create a Vue application by defining `src/App.vue`:

```vue
<template>
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
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

router.beforeEach((to, from) => {
  // ...
  return true;
});

export default router;
```

#### Type

```ts
// vite-env.d.ts
/// <reference types="vite-plugin-vue-routes/client" />
```

## Define Pages

Define a page by creating files in the `src/routes` directory:

```coffee
src/routes/path/to/+page.vue
```

### Page File Naming Convention

The file naming convention for the routes is as follows:

```coffee
src/routes/hello-world/+page.vue -> /hello-world

src/routes/products/+page.vue -> /products
src/routes/products/[id]/+page.vue -> /products/:id

src/routes/posts/[[title]]/+page.vue -> /posts/:title?

src/routes/blog/[...info]/+page.vue -> /blog/:info*

src/routes/(group)/foo/+page.vue -> /foo
src/routes/(group)/bar/+page.vue -> /bar

src/routes/(home)/+page.vue -> /
```

## Define Layouts

Define a layout by creating files in the `src/routes` directory:

```coffee
src/routes/path/to/+layout.vue
```

```vue
<!-- src/routes/path/to/+layout.vue -->
<template>
  <RouterView />
</template>
```

### Layout File Naming Convention

```coffee
src/routes/+layout.vue -> /+

src/routes/(dashboard)/+layout.vue -> /+
src/routes/(marketing)/+layout.vue -> /+

src/routes/users/[username]/+layout.vue -> /users/:username/+
```

## Define Errors

Define an error page by creating files in the `src/routes` directory:

```coffee
src/routes/+error.vue
```

```vue
<!-- src/routes/+error.vue -->
<template>
  <div>Error</div>
</template>
```

### Error File Naming Convention

```coffee
src/routes/+error.vue -> /:slug(.*)*
```

### Resource Prefetching

```ts
// vite.config.ts
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueRoutes from 'vite-plugin-vue-routes';
import prefetchChunk from 'vite-plugin-prefetch-chunk';

export default defineConfig({
  plugins: [
    vue(),
    vueRoutes(),
    prefetchChunk(), // Integrate with this plugin
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
});
```

## Documentation

To learn more about `vite-plugin-vue-routes`, check [its documentation](https://vitesheet.onrender.com/vite-plugin-vue-routes/).

## Examples

See [`./examples`](./examples).
