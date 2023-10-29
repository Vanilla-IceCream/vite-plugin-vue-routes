import { ViteSSG } from 'vite-ssg';

import router from '~/plugins/router';

import App from './App.vue';

export const createApp = ViteSSG(
  App,
  router,
  (ctx) => {
    // ctx.app.use
  },
  { rootContainer: '#root' },
);
