import type { Plugin } from 'vite';
import path from 'path';
import { glob } from 'glob';

import type { PluginOptions } from './types';
import generateRoutes from './generateRoutes';
import defineRegistry from './defineRegistry';

export default function vueRoutes(options?: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      if (source === 'virtual:vue-routes/Layout.vue') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') {
        return generateRoutes(options);
      }

      if (id === 'virtual:vue-routes/Layout.vue') {
        const layouts = await glob(`src/layouts/*.vue`);

        const asyncLayouts = layouts.map((layout) => {
          const importName = path.basename(layout, '.vue');
          const importPath = path.resolve(process.cwd(), layout);
          return `${importName}: defineAsyncComponent(() => import('${importPath}')),`;
        });

        return `
          <script setup>
          import { defineAsyncComponent, ref, watch } from 'vue';
          import { useRoute } from 'vue-router';

          const layout = ref();
          const route = useRoute();

          const layouts = { ${asyncLayouts.join('')} };

          watch(
            () => route.meta?.layout,
            (val) => {
              layout.value = layouts[val || 'Default']
            },
            { immediate: true },
          );
          </script>

          <template>
            <component :is="layout"><slot></slot></component>
          </template>
        `;
      }

      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async (filePath) => {
        const fileExtension = path.basename(filePath);
        if (fileExtension === 'Registry.vue') server.restart();
      });

      server.watcher.on('unlink', async (filePath) => {
        const fileExtension = path.basename(filePath);
        if (fileExtension === 'Registry.vue') server.restart();
      });
    },
    async transform(code, id) {
      return defineRegistry(code, id);
    },
  };
}
