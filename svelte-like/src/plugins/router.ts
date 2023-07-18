import { createWebHistory, createRouter } from 'vue-router';

import routes from 'virtual:vue-routes';

console.log(routes);

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

        {
          path: '/layout-page/+',
          component: () => import('~/routes/layout-page/+layout.vue'),
          children: [
            { path: '/layout-page', component: () => import('~/routes/layout-page/+page.vue') },
          ],
        },

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
    {
      path: '/:slug(.*)*',
      component: () => import('~/Error.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { top: 0 };
  },
});

export default router;
