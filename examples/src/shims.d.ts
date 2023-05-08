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

interface RegistryOptions {
  layout?: string;
  middleware?: string[];
}

declare function defineRegistry(options?: RegistryOptions): void;

declare module 'virtual:vue-routes-layout' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
