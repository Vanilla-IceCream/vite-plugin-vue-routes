import { resolve } from 'path';
import { test, expect } from 'vitest';

import generateRoutes from '../generateRoutes';

test('basic', async () => {
  const routesDir = resolve(__dirname, '../../examples/basic/src/routes');
  const generated = await generateRoutes({ routesDir });
  const routes = generated.replace(new RegExp(routesDir, 'g'), '~/routes');

  expect(routes).toMatchInlineSnapshot(`
    "export default [
      {
        "path": "/+",
        "component": () => import('~/routes/+layout.vue?prefetch'),
        "children": [
          {
            "path": "/about",
            "component": () => import('~/routes/about/+page.vue?prefetch')
          },
          {
            "path": "/",
            "component": () => import('~/routes/(home)/+page.vue?prefetch')
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue?prefetch')
      }
    ];"
  `);
});

test('layouts', async () => {
  const routesDir = resolve(__dirname, '../../examples/layouts/src/routes');
  const generated = await generateRoutes({ routesDir });
  const routes = generated.replace(new RegExp(routesDir, 'g'), '~/routes');

  expect(routes).toMatchInlineSnapshot(`
    "export default [
      {
        "path": "/+",
        "component": () => import('~/routes/+layout.vue?prefetch'),
        "children": [
          {
            "path": "/layout-page/+",
            "component": () => import('~/routes/layout-page/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/layout-page",
                "component": () => import('~/routes/layout-page/+page.vue?prefetch')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(marketing)/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/about",
                "component": () => import('~/routes/(marketing)/about/+page.vue?prefetch')
              },
              {
                "path": "/",
                "component": () => import('~/routes/(marketing)/(home)/+page.vue?prefetch')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(app)/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/dashboard",
                "component": () => import('~/routes/(app)/dashboard/+page.vue?prefetch')
              },
              {
                "path": "/admin",
                "component": () => import('~/routes/(app)/admin/+page.vue?prefetch')
              }
            ]
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue?prefetch')
      }
    ];"
  `);
});

test('nested', async () => {
  const routesDir = resolve(__dirname, '../../examples/nested/src/routes');
  const generated = await generateRoutes({ routesDir });
  const routes = generated.replace(new RegExp(routesDir, 'g'), '~/routes');

  expect(routes).toMatchInlineSnapshot(`
    "export default [
      {
        "path": "/+",
        "component": () => import('~/routes/+layout.vue?prefetch'),
        "children": [
          {
            "path": "/+",
            "component": () => import('~/routes/(marketing)/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/about",
                "component": () => import('~/routes/(marketing)/about/+page.vue?prefetch')
              },
              {
                "path": "/",
                "component": () => import('~/routes/(marketing)/(home)/+page.vue?prefetch')
              }
            ]
          },
          {
            "path": "/layout-page/+",
            "component": () => import('~/routes/layout-page/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/layout-page",
                "component": () => import('~/routes/layout-page/+page.vue?prefetch')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(app)/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/admin/+",
                "component": () => import('~/routes/(app)/admin/+layout.vue?prefetch'),
                "children": [
                  {
                    "path": "/admin",
                    "component": () => import('~/routes/(app)/admin/+page.vue?prefetch')
                  },
                  {
                    "path": "/admin/theme",
                    "component": () => import('~/routes/(app)/admin/theme/+page.vue?prefetch')
                  }
                ]
              },
              {
                "path": "/dashboard",
                "component": () => import('~/routes/(app)/dashboard/+page.vue?prefetch')
              }
            ]
          },
          {
            "path": "/users/:username/+",
            "component": () => import('~/routes/users/[username]/+layout.vue?prefetch'),
            "children": [
              {
                "path": "/users/:username/profile",
                "component": () => import('~/routes/users/[username]/profile/+page.vue?prefetch')
              },
              {
                "path": "/users/:username/posts",
                "component": () => import('~/routes/users/[username]/posts/+page.vue?prefetch')
              },
              {
                "path": "/users/:username",
                "component": () => import('~/routes/users/[username]/(home)/+page.vue?prefetch')
              }
            ]
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue?prefetch')
      }
    ];"
  `);
});

test('params', async () => {
  const routesDir = resolve(__dirname, '../../examples/params/src/routes');
  const generated = await generateRoutes({ routesDir });
  const routes = generated.replace(new RegExp(routesDir, 'g'), '~/routes');

  expect(routes).toMatchInlineSnapshot(`
    "export default [
      {
        "path": "/dashboard",
        "component": () => import('~/routes/dashboard/+page.vue?prefetch')
      },
      {
        "path": "/products",
        "component": () => import('~/routes/products/+page.vue?prefetch')
      },
      {
        "path": "/hello-world",
        "component": () => import('~/routes/hello-world/+page.vue?prefetch')
      },
      {
        "path": "/",
        "component": () => import('~/routes/(home)/+page.vue?prefetch')
      },
      {
        "path": "/posts/:title?",
        "component": () => import('~/routes/posts/[[title]]/+page.vue?prefetch')
      },
      {
        "path": "/products/:id",
        "component": () => import('~/routes/products/[id]/+page.vue?prefetch')
      },
      {
        "path": "/blog/:info*",
        "component": () => import('~/routes/blog/[...info]/+page.vue?prefetch')
      },
      {
        "path": "/foo",
        "component": () => import('~/routes/(group)/foo/+page.vue?prefetch')
      },
      {
        "path": "/bar",
        "component": () => import('~/routes/(group)/bar/+page.vue?prefetch')
      },
      {
        "path": "/users/:username/+",
        "component": () => import('~/routes/users/[username]/+layout.vue?prefetch'),
        "children": [
          {
            "path": "/users/:username/profile",
            "component": () => import('~/routes/users/[username]/profile/+page.vue?prefetch')
          },
          {
            "path": "/users/:username/posts",
            "component": () => import('~/routes/users/[username]/posts/+page.vue?prefetch')
          },
          {
            "path": "/users/:username",
            "component": () => import('~/routes/users/[username]/(home)/+page.vue?prefetch')
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue?prefetch')
      }
    ];"
  `);
});
