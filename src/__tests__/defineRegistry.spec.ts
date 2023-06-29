import { test, expect, vi } from 'vitest';

import defineRegistry from '../defineRegistry';

vi.mock('glob');

test('defineRegistry', async () => {
  const glob = await import('glob');

  glob.glob = vi.fn((pattern) => {
    if (pattern === 'src/layouts/*.vue') {
      return ['src/layouts/Default.vue'];
    }

    if (pattern === 'src/middleware/*.{ts,js}') {
      return ['src/middleware/default.ts'];
    }

    return [];
  }) as any;

  const code = `
    <template>
      <div>Default</div>
    </template>
  `;

  const generated = await defineRegistry(code, 'Registry.vue');
  expect(generated).toMatchSnapshot();
});

test('defineRegistry - layout', async () => {
  const glob = await import('glob');

  glob.glob = vi.fn((pattern) => {
    if (pattern === 'src/layouts/*.vue') {
      return ['src/layouts/Violet.vue'];
    }

    if (pattern === 'src/middleware/*.{ts,js}') {
      return ['src/middleware/default.ts'];
    }

    return [];
  }) as any;

  const code = `
    <script lang="ts" setup>
    defineRegistry({
      layout: 'Violet',
    });
    </script>

    <template>
      <div>Violet</div>
    </template>
  `;

  const generated = await defineRegistry(code, 'Registry.vue');
  expect(generated).toMatchSnapshot();
});

test('defineRegistry - middleware', async () => {
  const glob = await import('glob');

  glob.glob = vi.fn((pattern) => {
    if (pattern === 'src/layouts/*.vue') {
      return ['src/layouts/Violet.vue'];
    }

    if (pattern === 'src/middleware/*.{ts,js}') {
      return ['src/middleware/violet.ts'];
    }

    return [];
  }) as any;

  const code = `
    <script lang="ts" setup>
    defineRegistry({
      middleware: ['violet'],
    });
    </script>

    <template>
      <div>Violet</div>
    </template>
  `;

  const generated = await defineRegistry(code, 'Registry.vue');
  expect(generated).toMatchSnapshot();
});
