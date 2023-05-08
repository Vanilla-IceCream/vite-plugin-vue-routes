import type { Plugin } from 'vite';
import { glob } from 'glob';

interface PluginOptions {
  dirs?: string;
}

async function createRoutes(options?: PluginOptions) {
  const dirs = options?.dirs || 'routes';

  const files = await glob(`src/${dirs}/**/Registry.vue`);

  const paths = [...files]
    .map((file) => {
      const match = file.match(new RegExp(`^src\\/${dirs}\\/(.*)\\/Registry\\.vue$`));

      if (match) {
        let path = '/' + match[1];

        // /(group) ->
        path = path.replace(/\/\(.+?\)/g, '');
        if (!path) path += '/';

        // /[...rest] -> /:rest*
        path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*');

        // /[[id]] -> /:id?
        path = path.replace(/\[\[(.+?)\]\]/g, ':$1?');

        // /[id] -> /:id
        path = path.replace(/\[(.+?)\]/g, ':$1');

        return path;
      }

      return null;
    })
    .filter(Boolean);

  const lines: string[] = [];

  files.forEach((item, index) => {
    const mod = `import('${item.replace('src', '~')}')`;
    lines.push(`{ path: '${paths[index]}', component: () => ${mod} },`);
  });

  console.log(lines);

  return `
    export default () => {
      return [${lines.join('')}];
    };
  `;
}

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
        return createRoutes(options);
      }

      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async (file) => {
        server.ws.send({ type: 'full-reload' });
      });

      server.watcher.on('unlink', async (file) => {
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
