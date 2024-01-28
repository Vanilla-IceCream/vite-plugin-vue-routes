import type { RouterOptions } from 'vite-ssg';

import routes from 'virtual:vue-routes';

const router: RouterOptions = {
  base: import.meta.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
};

export default router;
