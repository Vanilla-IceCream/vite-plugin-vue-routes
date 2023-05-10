import path from 'path';
import { test, expect } from 'vitest';

import generateRoutes from '../generateRoutes';

test('generateRoutes', async () => {
  const funcStr = await generateRoutes({ dirs: path.resolve(__dirname, '../../examples/src/routes') });

  expect(funcStr).toMatchSnapshot();
});
