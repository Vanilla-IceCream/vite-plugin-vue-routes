import { resolve } from 'path';
import { test, expect } from 'vitest';

import generateRoutes from '../generateRoutes';

test('generateRoutes', async () => {
  const routesDir = resolve(__dirname, '../../examples/src/routes');
  const generated = await generateRoutes({ routesDir });

  const routes = generated.replace(new RegExp(routesDir, 'g'), '~/routes');
  expect(routes).toMatchSnapshot();
});
