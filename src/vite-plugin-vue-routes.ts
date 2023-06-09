import type { Plugin } from 'vite';
import path from 'path';

import type { PluginOptions } from './types';
import generateRoutes from './generateRoutes';
import generateLayouts from './generateLayouts';
import defineRegistry from './defineRegistry';

export default function vueRoutes(options?: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      if (source === 'virtual:vue-routes/Layout') return source;
      if (source === 'virtual:vue-routes/Layout.vue') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') return generateRoutes(options);
      if (id === 'virtual:vue-routes/Layout') return generateLayouts();
      if (id === 'virtual:vue-routes/Layout.vue') return generateLayouts(true);
      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async (filePath) => {
        const isRegistryFile = path.basename(filePath) === 'Registry.vue';
        const isLayoutsDir = path.dirname(filePath).includes('src/layouts');
        const isMiddlewareDir = path.dirname(filePath).includes('src/middleware');
        if (isRegistryFile || isLayoutsDir || isMiddlewareDir) server.restart();
      });

      server.watcher.on('unlink', async (filePath) => {
        const isRegistryFile = path.basename(filePath) === 'Registry.vue';
        const isLayoutsDir = path.dirname(filePath).includes('src/layouts');
        const isMiddlewareDir = path.dirname(filePath).includes('src/middleware');
        if (isRegistryFile || isLayoutsDir || isMiddlewareDir) server.restart();
      });
    },
    async transform(code, id) {
      return defineRegistry(code, id);
    },
  };
}
