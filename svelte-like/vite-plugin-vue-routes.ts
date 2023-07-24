import type { Plugin } from 'vite';
import path from 'path';

import generateRoutes from './generateRoutes';

export default function vueRoutes(): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') return generateRoutes({});
      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async (filePath) => {
        if (['+page.vue', '+layout.vue'].includes(path.basename(filePath))) server.restart();
      });

      server.watcher.on('unlink', async (filePath) => {
        if (['+page.vue', '+layout.vue'].includes(path.basename(filePath))) server.restart();
      });
    },
  };
}
