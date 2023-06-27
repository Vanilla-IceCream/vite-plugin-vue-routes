declare module 'virtual:vue-routes' {
  import type { RouteRecordRaw } from 'vue-router';
  const routes: () => RouteRecordRaw[];
  export default routes;
}

declare module 'virtual:vue-routes/Layout' {
  import type { DefineComponent } from 'vue';
  const Layout: DefineComponent<{}, {}, any>;
  export default Layout;
}

declare module 'virtual:vue-routes/Layout.vue' {
  import type { DefineComponent } from 'vue';
  const Layout: DefineComponent<{}, {}, any>;
  export default Layout;
}

interface RegistryOptions {
  layout?: string;
  middleware?: string[];
}

declare function defineRegistry(options?: RegistryOptions): void;
