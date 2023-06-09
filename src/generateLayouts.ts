import path from 'path';
import { glob } from 'glob';

export default async () => {
  const layouts = await glob(`src/layouts/*.vue`);

  const asyncLayouts = layouts.map((layout) => {
    const importName = path.basename(layout, '.vue');
    const importPath = path.resolve(process.cwd(), layout);
    return `${importName}: defineAsyncComponent(() => import('${importPath}')),`;
  });

  return `
    <script setup>
    import { defineAsyncComponent, ref, watch, markRaw } from 'vue';
    import { useRoute } from 'vue-router';

    const layout = ref();
    const route = useRoute();

    const layouts = { ${asyncLayouts.join('')} };

    watch(
      () => route.meta?.layout,
      (val) => {
        layout.value = markRaw(layouts[val || 'Default']);
      },
      { immediate: true },
    );
    </script>

    <template>
      <component :is="layout"><slot></slot></component>
    </template>
  `;
};
