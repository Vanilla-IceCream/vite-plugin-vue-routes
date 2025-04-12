import type { Plugin } from 'vite';
import path from 'path';

import type { PluginOptions } from './types';
import generateRoutes from './generateRoutes';

export default function vueRoutes(options?: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') return generateRoutes(options);
      return null;
    },
    configureServer(server) {
      const targetFiles = new Set(['+page.vue', '+layout.vue', '+error.vue']);
      const shouldRestart = (filePath: string) => targetFiles.has(path.basename(filePath));

      const restartIfNecessary = (filePath: string) => {
        if (shouldRestart(filePath)) server.restart();
      };

      server.watcher.on('add', restartIfNecessary);
      server.watcher.on('unlink', restartIfNecessary);
    },
  };
}
