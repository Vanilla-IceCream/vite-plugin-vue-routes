import os from 'os';
import { resolve } from 'path';
import { glob } from 'glob';
import maxBy from 'lodash.maxby';

import type { PluginOptions } from './types';

type Route = { path: string; component: string; children?: Route[] };
type Routes = Array<{ route: Route; level: number; key: string }>;

const isWindows = os.type() === 'Windows_NT';

export default async (options?: PluginOptions) => {
  const routesDir = options?.routesDir || resolve(process.cwd(), 'src', 'routes');

  const files = await glob(`${routesDir}/**/+{page,layout}.vue`, { posix: true });

  const routes = [] as Routes;
  const hasRootLayout = files.includes(`${routesDir}/+layout.vue`);

  files.forEach((item) => {
    let level = 0;

    if (hasRootLayout) {
      level += 1;
    }

    let cur = item;
    let comp = item;

    if (isWindows) {
      cur = resolve(process.cwd(), cur).replace(routesDir, '').replace(/\\/g, '/');
      comp = resolve(process.cwd(), comp);
    } else {
      cur = cur.replace(routesDir, '');
    }

    const key = cur
      .replace('+layout.vue', '')
      .replace('+page.vue', '')
      .split('/')
      .filter(Boolean)
      .join('/');

    let path = cur.replace('layout.vue', '').replace('/+page.vue', '');

    // /(group) ->
    path = path.replace(/\/\(.+?\)/g, '');
    if (!path) path += '/';

    // /[...rest] -> /:rest*
    path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*');

    // /[[id]] -> /:id?
    path = path.replace(/\[\[(.+?)\]\]/g, ':$1?');

    // /[id] -> /:id
    path = path.replace(/\[(.+?)\]/g, ':$1');

    const component = `() => import('${comp}')`;

    if (path.includes('/+')) {
      routes.push({ route: { path, component, children: [] }, level, key });
    } else {
      routes.push({ route: { path, component }, level, key });
    }
  });

  routes.forEach((item) => {
    if (item.key) {
      routes
        .filter((route) => route.key && Array.isArray(route.route.children))
        .forEach((route) => {
          if (item.key.startsWith(route.key)) {
            item.level += 1;
          }
        });
    }
  });

  function createRoutes(
    routes: Routes,
    level = 0,
    curArr: Route[] = [],
    curKeysArr: string[] = [],
  ) {
    const arr = [] as Route[];
    const keysArr = [] as string[];

    const layouts = routes.filter((r) => Array.isArray(r.route.children));

    let maxLevelOfLayouts = 0;

    if (layouts.length) {
      maxLevelOfLayouts = Number(maxBy(layouts, (item) => item.level)?.level) - level;
    } else {
      return routes.map((r) => r.route);
    }

    if (maxLevelOfLayouts === 0) {
      if (!hasRootLayout) {
        const rootRoutes = routes.filter((r) => r.level === 0).map((r) => r.route);
        return [...rootRoutes, ...curArr];
      }

      return curArr;
    }

    const layoutsMaxLevel = layouts.filter((l) => l.level === maxLevelOfLayouts);

    for (let i = 0; i < layoutsMaxLevel.length; i++) {
      const layout = layoutsMaxLevel[i];

      const cur = {} as Route;
      cur.path = layout.route.path;
      cur.component = layout.route.component;

      if (curKeysArr.filter((ck) => ck.startsWith(layout.key)).length) {
        const sameLayer = routes
          .filter(
            (r) =>
              r.key.startsWith(layout.key) && !r.route.children && r.level === maxLevelOfLayouts,
          )
          .map((r) => r.route);

        cur.children = [...curArr, ...sameLayer];
      } else {
        cur.children = routes
          .filter((r) => r.key.startsWith(layout.key) && !r.route.children)
          .map((r) => r.route);
      }

      arr.push(cur);
      keysArr.push(layout.key);
    }

    return createRoutes(routes, level + 1, arr, keysArr);
  }

  const created = createRoutes(routes);

  const errorFile = await glob(`${routesDir}/+error.vue`, { posix: true });

  if (errorFile?.length) {
    let comp = errorFile[0];

    if (isWindows) {
      comp = resolve(process.cwd(), comp);
    }

    created.push({
      path: '/:slug(.*)*',
      component: `() => import('${comp}')`,
    });
  }

  const stringified = JSON.stringify(created, null, 2);
  const converted = stringified.replace(/"\(\) => import\(/g, '() => import(').replace(/\)"/g, ')');

  return `export default ${converted};`;
};
