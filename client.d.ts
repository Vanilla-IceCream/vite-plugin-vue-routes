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
