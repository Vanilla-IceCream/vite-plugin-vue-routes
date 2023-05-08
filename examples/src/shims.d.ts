declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'virtual:vue-routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: () => RouteRecordRaw[];
  export default routes;
}
