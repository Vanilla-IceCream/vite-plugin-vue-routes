import path from 'path';
import { describe, it, test, expect } from 'vitest';
import { createServer, build } from 'vite';
import vue from '@vitejs/plugin-vue';

import vueRoutes from '../vite-plugin-vue-routes';

describe('plugin', () => {
  it('exec', () => {
    const plugin = vueRoutes();
    expect(plugin).toHaveProperty('name');

    const plugin2 = vueRoutes({ routesDir: 'pages' });
    expect(plugin2).toHaveProperty('name');
  });
});

test('dev', async () => {
  const server = await createServer({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './fixtures/dist'),
          format: 'commonjs',
        },
      },
    },
    plugins: [vue(), vueRoutes()],
  });

  await server.listen();

  // TODO:

  await server.close();
});

test('build', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './fixtures/dist'),
          format: 'commonjs',
        },
      },
    },
    plugins: [vue(), vueRoutes()],
  });
});

test('preview', async () => {
  await build({
    logLevel: 'silent',
    build: {
      rollupOptions: {
        output: {
          dir: path.resolve(__dirname, './fixtures/dist'),
          format: 'commonjs',
        },
      },
    },
    plugins: [vue(), vueRoutes()],
  });

  // TODO:
});
