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
      external: ['fs', 'path', 'glob', '@vue-macros/common'],
    },
  },
  plugins: [dts()],
  test: {
    testTimeout: 10_000,
  },
});
