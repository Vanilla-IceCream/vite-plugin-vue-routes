import { test, expect } from 'vitest';

import generateLayouts from '../generateLayouts';

test('generateLayouts', async () => {
  const generated = await generateLayouts();
  expect(generated).toMatchSnapshot();
});

test('generateLayouts - sfc', async () => {
  const generated = await generateLayouts(true);
  expect(generated).toMatchSnapshot();
});
