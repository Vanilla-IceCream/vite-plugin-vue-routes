import type { Plugin } from 'vite';

import type { PluginOptions } from './types';
import generateRoutes from './generateRoutes';
import defineRegistry from './defineRegistry';

export default function vueRoutes(options?: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') {
        return generateRoutes(options);
      }

      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async () => {
        server.ws.send({ type: 'full-reload' });
      });

      server.watcher.on('unlink', async () => {
        server.ws.send({ type: 'full-reload' });
      });
    },
    async transform(code, id) {
      return defineRegistry(code, id);
    },
  };
}
