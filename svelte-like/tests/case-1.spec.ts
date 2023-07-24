import { resolve } from 'path';
import { expect, test } from 'vitest';

import generateRoutes from '../generateRoutes';

test('case-1', async () => {
  const routes = await generateRoutes({ routesDir: resolve(__dirname, '../src/routes-1') });
  const trimRoutes = routes.replace(new RegExp(resolve(__dirname, '../src'), 'g'), '~');

  console.log(trimRoutes);

  // expect(trimRoutes).toMatch(
  //   JSON.stringify(
  //     [
  //       {
  //         path: '/about',
  //         component: "() => import('~/routes-1/about/+page.vue')",
  //       },
  //       {
  //         path: '/',
  //         component: "() => import('~/routes-1/(home)/+page.vue')",
  //       },
  //     ],
  //     null,
  //     2,
  //   )
  //     .replace(/"\(\) => import\(/g, '() => import(')
  //     .replace(/\)"/g, ')'),
  // );
});
