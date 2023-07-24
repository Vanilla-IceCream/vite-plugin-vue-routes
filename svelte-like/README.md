# Tests

## Case 1

```coffee
src/routes/+page.vue -> /
src/routes/about/+page.vue -> /about
```

```ts
const routes = [
  { path: '/', component: () => import('~/routes/+page.vue') },
  { path: '/about', component: () => import('~/routes/about/+page.vue') },
];
```

```coffee
src/routes/hello-world/+page.vue -> /hello-world

src/routes/products/+page.vue -> /products
src/routes/products/[id]/+page.vue -> /products/:id

src/routes/posts/[[title]]/+page.vue -> /posts/:title?

src/routes/blog/[...info]/+page.vue -> /blog/:info*

src/routes/(group)/foo/+page.vue -> /foo
src/routes/(group)/bar/+page.vue -> /bar

src/routes/(home)/+page.vue -> /
```

## Case 2

```coffee
src/routes/+layout.vue -> /+
src/routes/(home)/+page.vue -> /
src/routes/about/+page.vue -> /about
```

```ts
const routes = [
  {
    path: '/+',
    component: () => import('~/routes/+layout.vue'),
    children: [
      { path: '/', component: () => import('~/routes/(home)/+page.vue') },
      { path: '/about', component: () => import('~/routes/about/+page.vue') },
    ],
  },
];
```

## Case 3

```coffee
src/routes/+layout.vue -> /+

src/routes/(app)/+layout.vue -> /+
src/routes/(app)/dashboard/+page.vue -> /dashboard
src/routes/(app)/admin/+page.vue -> /admin

src/routes/(marketing)/+layout.vue -> /+
src/routes/(marketing)/(home)/+page.vue -> /
src/routes/(marketing)/about/+page.vue -> /about
```

```ts
const routes = [
  {
    path: '/+',
    component: () => import('~/routes/+layout.vue'),
    children: [
      {
        path: '/+',
        component: () => import('~/routes/(app)/+layout.vue'),
        children: [
          { path: '/dashboard', component: () => import('~/routes/(app)/dashboard/+page.vue') },
          { path: '/admin', component: () => import('~/routes/(app)/admin/+page.vue') },
        ],
      },
      {
        path: '/+',
        component: () => import('~/routes/(marketing)/+layout.vue'),
        children: [
          { path: '/', component: () => import('~/routes/(marketing)/(home)/+page.vue') },
          { path: '/about', component: () => import('~/routes/(marketing)/about/+page.vue') },
        ],
      },
    ],
  },
];
```

## Case 4

```coffee
src/routes/+layout.vue -> /+

src/routes/users/[username]/+layout.vue -> /users/:username/+
src/routes/users/[username]/(home)/+page.vue -> /users/:username
src/routes/users/[username]/posts/+page.vue -> /users/:username/posts
src/routes/users/[username]/profile/+page.vue -> /users/:username/profile
```

```ts
const routes = [
  {
    path: '/+',
    component: () => import('~/routes/+layout.vue'),
    children: [
      {
        path: '/users/:username/+',
        component: () => import('~/routes/users/[username]/+layout.vue'),
        children: [
          {
            path: '/users/:username',
            component: () => import('~/routes/users/[username]/(home)/+page.vue'),
          },
          {
            path: '/users/:username/posts',
            component: () => import('~/routes/users/[username]/posts/+page.vue'),
          },
          {
            path: '/users/:username/profile',
            component: () => import('~/routes/users/[username]/profile/+page.vue'),
          },
        ],
      },
    ],
  },
];
```
