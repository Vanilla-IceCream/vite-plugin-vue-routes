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
  plugins: [
    vue(),
    vueRoutes(), // Default: { routesDir: <rootDir>/src/routes }
  ],
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

## Define Routes

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

## Documentation

To learn more about `vite-plugin-vue-routes`, check [its documentation](https://vitesheet.onrender.com/vite-plugin-vue-routes/).
