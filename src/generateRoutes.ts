import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

import type { PluginOptions } from './types';

export default async (options?: PluginOptions) => {
  const routesDir = options?.routesDir || path.resolve(process.cwd(), 'src/routes');

  const files = await glob(`${routesDir}/**/Registry.vue`);

  const paths = [...files]
    .map((file) => {
      const match = file.match(new RegExp(`^${routesDir}\\/(.*)\\/Registry\\.vue$`));

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

    const file = fs.readFileSync(item, 'utf-8');

    if (file.includes('<RouterView />')) {
      lines.push(`{ path: '${paths[index]}', component: () => ${mod}, children: [] },`);
    } else {
      lines.push(`{ path: '${paths[index]}', component: () => ${mod} },`);
    }
  });

  let hasMoves: string[] = [];

  const routes = lines.map((route) => {
    if (route.includes('children: []')) {
      const path = route.match(/path: '(.*)',/)?.[1];

      const children = lines.filter(
        (r) => r.includes(`path: '${path}`) && !r.includes('children: []'),
      );

      hasMoves = [...hasMoves, ...children];

      return route.replace('children: []', `children: [${children.join(' ')}]`);
    }

    if (hasMoves.includes(route)) {
      return '';
    }

    return route;
  });

  return `export default () => [${routes.join('')}];`;
};
