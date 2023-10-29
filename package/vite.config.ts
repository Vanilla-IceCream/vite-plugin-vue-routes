import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/vite-plugin-vue-routes.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['path', 'glob', 'lodash.maxby'],
    },
  },
  plugins: [dts()],
  test: {
    globals: true,
    testTimeout: 10_000,
  },
});
