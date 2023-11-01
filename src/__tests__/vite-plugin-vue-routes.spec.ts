import { resolve } from 'path';
import { test, expect } from 'vitest';

import vueRoutes from '../vite-plugin-vue-routes';

test('vite-plugin-vue-routes', () => {
  const plugin = vueRoutes();
  expect(plugin.name).toBe('vite-plugin-vue-routes');
});

test('vite-plugin-vue-routes', () => {
  const plugin = vueRoutes({ routesDir: resolve(__dirname, '../../../examples/params/src/routes') });
  expect(plugin.name).toBe('vite-plugin-vue-routes');
});
