import path from 'path';
import { glob } from 'glob';

import type { PluginOptions } from './types';

export default async function createRoutes(options?: PluginOptions) {
  const dirs = options?.dirs || path.resolve(process.cwd(), 'src/routes');

  const files = await glob(`${dirs}/**/Registry.vue`);

  const paths = [...files]
    .map((file) => {
      const match = file.match(new RegExp(`^${dirs}\\/(.*)\\/Registry\\.vue$`));

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
    const mod = `import('${item}')`;
    lines.push(`{ path: '${paths[index]}', component: () => ${mod} },`);
  });

  return `export default () => [${lines.join('')}];`;
}
