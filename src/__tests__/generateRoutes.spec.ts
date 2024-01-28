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
        "component": () => import('~/routes/+layout.vue'),
        "children": [
          {
            "path": "/about",
            "component": () => import('~/routes/about/+page.vue')
          },
          {
            "path": "/",
            "component": () => import('~/routes/(home)/+page.vue')
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue')
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
        "component": () => import('~/routes/+layout.vue'),
        "children": [
          {
            "path": "/layout-page/+",
            "component": () => import('~/routes/layout-page/+layout.vue'),
            "children": [
              {
                "path": "/layout-page",
                "component": () => import('~/routes/layout-page/+page.vue')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(app)/+layout.vue'),
            "children": [
              {
                "path": "/dashboard",
                "component": () => import('~/routes/(app)/dashboard/+page.vue')
              },
              {
                "path": "/admin",
                "component": () => import('~/routes/(app)/admin/+page.vue')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(marketing)/+layout.vue'),
            "children": [
              {
                "path": "/about",
                "component": () => import('~/routes/(marketing)/about/+page.vue')
              },
              {
                "path": "/",
                "component": () => import('~/routes/(marketing)/(home)/+page.vue')
              }
            ]
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue')
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
        "component": () => import('~/routes/+layout.vue'),
        "children": [
          {
            "path": "/layout-page/+",
            "component": () => import('~/routes/layout-page/+layout.vue'),
            "children": [
              {
                "path": "/layout-page",
                "component": () => import('~/routes/layout-page/+page.vue')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(marketing)/+layout.vue'),
            "children": [
              {
                "path": "/about",
                "component": () => import('~/routes/(marketing)/about/+page.vue')
              },
              {
                "path": "/",
                "component": () => import('~/routes/(marketing)/(home)/+page.vue')
              }
            ]
          },
          {
            "path": "/+",
            "component": () => import('~/routes/(app)/+layout.vue'),
            "children": [
              {
                "path": "/admin/+",
                "component": () => import('~/routes/(app)/admin/+layout.vue'),
                "children": [
                  {
                    "path": "/admin",
                    "component": () => import('~/routes/(app)/admin/+page.vue')
                  },
                  {
                    "path": "/admin/theme",
                    "component": () => import('~/routes/(app)/admin/theme/+page.vue')
                  }
                ]
              },
              {
                "path": "/dashboard",
                "component": () => import('~/routes/(app)/dashboard/+page.vue')
              }
            ]
          },
          {
            "path": "/users/:username/+",
            "component": () => import('~/routes/users/[username]/+layout.vue'),
            "children": [
              {
                "path": "/users/:username/profile",
                "component": () => import('~/routes/users/[username]/profile/+page.vue')
              },
              {
                "path": "/users/:username/posts",
                "component": () => import('~/routes/users/[username]/posts/+page.vue')
              },
              {
                "path": "/users/:username",
                "component": () => import('~/routes/users/[username]/(home)/+page.vue')
              }
            ]
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue')
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
        "path": "/products",
        "component": () => import('~/routes/products/+page.vue')
      },
      {
        "path": "/hello-world",
        "component": () => import('~/routes/hello-world/+page.vue')
      },
      {
        "path": "/dashboard",
        "component": () => import('~/routes/dashboard/+page.vue')
      },
      {
        "path": "/",
        "component": () => import('~/routes/(home)/+page.vue')
      },
      {
        "path": "/posts/:title?",
        "component": () => import('~/routes/posts/[[title]]/+page.vue')
      },
      {
        "path": "/products/:id",
        "component": () => import('~/routes/products/[id]/+page.vue')
      },
      {
        "path": "/blog/:info*",
        "component": () => import('~/routes/blog/[...info]/+page.vue')
      },
      {
        "path": "/foo",
        "component": () => import('~/routes/(group)/foo/+page.vue')
      },
      {
        "path": "/bar",
        "component": () => import('~/routes/(group)/bar/+page.vue')
      },
      {
        "path": "/users/:username/+",
        "component": () => import('~/routes/users/[username]/+layout.vue'),
        "children": [
          {
            "path": "/users/:username/profile",
            "component": () => import('~/routes/users/[username]/profile/+page.vue')
          },
          {
            "path": "/users/:username/posts",
            "component": () => import('~/routes/users/[username]/posts/+page.vue')
          },
          {
            "path": "/users/:username",
            "component": () => import('~/routes/users/[username]/(home)/+page.vue')
          }
        ]
      },
      {
        "path": "/:slug(.*)*",
        "component": () => import('~/routes/+error.vue')
      }
    ];"
  `);
});
