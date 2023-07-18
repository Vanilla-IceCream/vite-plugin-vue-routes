import type { Plugin } from 'vite';
import path from 'path';
import { glob } from 'glob';

export default function vueRoutes(): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') {
        const routesDir = path.resolve(process.cwd(), 'src/routes');
        const files = await glob(`${routesDir}/**/+{page,layout}.vue`);

        console.log('');
        console.log('');

        const routes = [] as Array<any>;

        files.forEach((item) => {
          const level = item.replace(`${routesDir}`, '').split('/').filter(Boolean).length;

          const key = item
            .replace(`${routesDir}`, '')
            .replace('+layout.vue', '')
            .replace('+page.vue', '')
            .split('/')
            .filter(Boolean)
            .join('/');

          let path = item
            .replace(`${routesDir}`, '')
            .replace('layout.vue', '')
            .replace('/+page.vue', '');

          // /(group) ->
          path = path.replace(/\/\(.+?\)/g, '');
          if (!path) path += '/';

          // /[...rest] -> /:rest*
          path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*');

          // /[[id]] -> /:id?
          path = path.replace(/\[\[(.+?)\]\]/g, ':$1?');

          // /[id] -> /:id
          path = path.replace(/\[(.+?)\]/g, ':$1');

          const component = `() => import('${item}')`;

          if (path.includes('/+')) {
            routes.push({ route: { path, component, children: [] }, level, key });
          } else {
            routes.push({ route: { path, component }, level, key });
          }
        });

        console.log(routes);

        console.log('');
        return `export default [];`;
      }

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
  };
}
