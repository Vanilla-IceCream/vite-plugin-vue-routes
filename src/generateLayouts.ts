import path from 'path';
import { glob } from 'glob';

export default async (useSfc = false) => {
  const layouts = await glob(`src/layouts/*.vue`);

  const asyncLayouts = layouts.map((layout) => {
    const importName = path.basename(layout, '.vue');
    const importPath = path.resolve(process.cwd(), layout);
    return `${importName}: defineAsyncComponent(() => import('${importPath}')),`;
  });

  if (useSfc) {
    return `
      <script setup>
      import { defineComponent, defineAsyncComponent, ref, watch, markRaw, useSlots, h } from 'vue';
      import { useRoute } from 'vue-router';

      const layout = ref();
      const slots = useSlots();
      const route = useRoute();

      const layouts = {
        __Placeholder: defineComponent(() => () => h('div', slots.default())),
        ${asyncLayouts.join('')}
      };

      watch(
        () => route.meta?.layout,
        (val) => {
          layout.value = markRaw(layouts[val || '__Placeholder']);
        },
        { immediate: true },
      );
      </script>

      <template>
        <component :is="layout"><slot></slot></component>
      </template>
    `;
  }

  return `
    import { defineComponent, defineAsyncComponent, ref, watch, markRaw, useSlots, h } from 'vue';
    import { useRoute } from 'vue-router';

    export default defineComponent({
      setup() {
        const layout = ref();
        const slots = useSlots();
        const route = useRoute();

        const layouts = {
          __Placeholder: defineComponent(() => () => h('div', slots.default())),
          ${asyncLayouts.join('')}
        };

        watch(
          () => route.meta?.layout,
          (val) => {
            layout.value = markRaw(layouts[val || '__Placeholder']);
          },
          { immediate: true },
        );

        return {
          layout,
        };
      },
      render() {
        return h(this.layout, {}, () => this.$slots.default());
      },
    });
  `;
};
