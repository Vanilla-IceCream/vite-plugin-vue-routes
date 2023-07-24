import { resolve } from 'path';
import { glob } from 'glob';
import { maxBy } from 'lodash';

export default async (options: { routesDir?: string }) => {
  const routesDir = options?.routesDir || resolve(process.cwd(), 'src/routes');

  const files = await glob(`${routesDir}/**/+{page,layout}.vue`);

  const routes = [] as Array<any>;

  files.forEach((item) => {
    // level -> 1
    let level = 1;

    if (
      files.some((file) => file.startsWith(routesDir + '/+')) &&
      !item.startsWith(routesDir + '/+')
    ) {
      // level -> 2
      level += 1;
    }

    const key = item
      .replace(`${routesDir}`, '')
      .replace('+layout.vue', '')
      .replace('+page.vue', '')
      .split('/')
      .filter(Boolean)
      .join('/');

    let path = item.replace(`${routesDir}`, '').replace('layout.vue', '').replace('/+page.vue', '');

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

  // level -> 3 (layout)
  routes.forEach((r) => {
    if (r.key && Array.isArray(r.route.children)) {
      const plus = routes
        .filter((_r) => _r.key && _r.route.children && _r.key !== r.key)
        .find((_r) => r.key.startsWith(_r.key));

      if (plus) {
        r.level += 1;
      }
    }
  });

  // level -> 3 (page)
  routes.forEach((r) => {
    if (r.key && !Array.isArray(r.route.children)) {
      routes
        .filter((_r) => _r.level === 3 && Array.isArray(_r.route.children))
        .forEach((_rr) => {
          if (r.key.startsWith(_rr.key)) {
            r.level += 1;
          }
        });
    }
  });

  function createRoutes(routes: any[], level = 0, curArr: any = [], curKeysArr: any = []) {
    const arr = [] as any;
    const keysArr = [] as any;

    const layouts = routes.filter((r) => Array.isArray(r.route.children));

    let maxLevelOfLayouts = 0;
    if (layouts.length) {
      maxLevelOfLayouts = maxBy(layouts, (item: any) => item.level).level - level;
    } else {
      return routes.map((r) => r.route);
    }

    if (maxLevelOfLayouts === 0) return curArr;

    const layoutsMaxLevel = layouts.filter((l) => l.level === maxLevelOfLayouts);

    for (let i = 0; i < layoutsMaxLevel.length; i++) {
      const layout = layoutsMaxLevel[i];

      const cur = {} as any;
      cur.path = layout.route.path;
      cur.component = layout.route.component;

      if (curKeysArr.join(',').includes(layout.key)) {
        const sameLayer = routes
          .filter(
            (r) => r.key.includes(layout.key) && !r.route.children && r.level === maxLevelOfLayouts,
          )
          .map((r) => r.route);

        cur.children = [...curArr, ...sameLayer];
      } else {
        cur.children = routes
          .filter((r) => r.key.includes(layout.key) && !r.route.children)
          .map((r) => r.route);
      }

      arr.push(cur);
      keysArr.push(layout.key);
    }

    return createRoutes(routes, level + 1, arr, keysArr);
  }

  const _routes = JSON.stringify(createRoutes(routes), null, 2);
  const converted = _routes.replace(/"\(\) => import\(/g, '() => import(').replace(/\)"/g, ')');

  return `export default ${converted};`;
};