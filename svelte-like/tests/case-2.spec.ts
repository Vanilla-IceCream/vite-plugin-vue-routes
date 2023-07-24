import { resolve } from 'path';
import { expect, test } from 'vitest';

import generateRoutes from '../generateRoutes';

test('case-2', async () => {
  const routes = await generateRoutes({ routesDir: resolve(__dirname, '../src/routes-2') });
  const trimRoutes = routes.replace(new RegExp(resolve(__dirname, '../src'), 'g'), '~');

  console.log(trimRoutes);


  // expect(trimRoutes).toMatch(
  //   JSON.stringify(
  //     [
  //       {
  //         route: {
  //           path: '/about',
  //           component: "() => import('~/routes-1/about/+page.vue')",
  //         },
  //         level: 2,
  //         key: 'about',
  //       },
  //       {
  //         route: {
  //           path: '/',
  //           component: "() => import('~/routes-1/(home)/+page.vue')",
  //         },
  //         level: 2,
  //         key: '(home)',
  //       },
  //     ],
  //     null,
  //     2,
  //   ),
  // );
});
