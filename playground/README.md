# Playground

## General

```coffee
src/routes/(home)/+page.vue -> /
src/routes/about/+page.vue -> /about
```

```ts
const routes = [
  { path: '/', component: () => import('~/routes/(home)/+page.vue') },
  { path: '/about', component: () => import('~/routes/about/+page.vue') },
];
```

## Case 1

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

## Case 2

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
