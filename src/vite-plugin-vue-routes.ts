import type { Plugin } from 'vite';
import path from 'path';
import { glob } from 'glob';
import { MagicString, getTransformResult, isCallOf, parseSFC, walkAST } from '@vue-macros/common';

import type { PluginOptions } from './types';
import generateRoutes from './generateRoutes';

export default function vueRoutes(options?: PluginOptions): Plugin {
  return {
    name: 'vite-plugin-vue-routes',
    enforce: 'pre',
    resolveId(source) {
      if (source === 'virtual:vue-routes') return source;
      return null;
    },
    async load(id) {
      if (id === 'virtual:vue-routes') {
        return generateRoutes(options);
      }

      return null;
    },
    configureServer(server) {
      server.watcher.on('add', async (file) => {
        server.ws.send({ type: 'full-reload' });
      });

      server.watcher.on('unlink', async (file) => {
        server.ws.send({ type: 'full-reload' });
      });
    },
    async transform(code, id) {
      if (path.basename(id) !== 'Registry.vue') return;

      const layouts = await glob(`src/layouts/*.vue`);
      if (!layouts.length) return;

      const s = new MagicString(code);

      if (code.includes('defineRegistry')) {
        const { scriptSetup, getSetupAst } = parseSFC(code, id);
        if (!scriptSetup) return;

        const offset = scriptSetup.loc.start.offset;

        const setupAst = getSetupAst()!;

        walkAST(setupAst, {
          enter(node) {
            if (isCallOf(node, 'defineRegistry')) {
              const match = code.match(/defineRegistry\(([\s\S]*?)\)/);

              const defineRegistryStr = match?.[1].trim();
              const defineRegistryObj = Function(`'use strict'; return (${defineRegistryStr})`)();
              const { layout, middleware } = JSON.parse(JSON.stringify(defineRegistryObj));

              if (layout && !middleware?.length) {
                function toTitleCase(str: string) {
                  return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
                  });
                }

                const layoutFileName = toTitleCase(layout);

                s.overwriteNode(node, `import Layout from '~/layouts/${layoutFileName}.vue'`, {
                  offset,
                });

                s.replace(
                  /<template>([\s\S]+)<\/template>/,
                  `<template>\n<Layout>$1</Layout>\n</template>`,
                );
              } else if (!layout && middleware?.length) {
                s.overwriteNode(node, '', { offset });

                let importMiddleware = '';

                for (let i = 0; i < middleware.length; i++) {
                  const middle = middleware[i];
                  importMiddleware += `import ${middle} from '~/middleware/${middle}';`;
                }

                s.prepend(`
                  <script lang="ts">
                  ${importMiddleware}

                  export default {
                    beforeRouteEnter(to, from) {
                      return [${middleware}].reduce((acc, func) => {
                        if (acc === true) return func(to, from);
                        return acc;
                      }, true);
                    },
                  };
                  </script>
                `);
              } else if (layout && middleware?.length) {
                function toTitleCase(str: string) {
                  return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
                  });
                }

                const layoutFileName = toTitleCase(layout);

                s.overwriteNode(node, `import Layout from '~/layouts/${layoutFileName}.vue'`, {
                  offset,
                });

                s.replace(
                  /<template>([\s\S]+)<\/template>/,
                  `<template>\n<Layout>$1</Layout>\n</template>`,
                );

                let importMiddleware = '';

                for (let i = 0; i < middleware.length; i++) {
                  const middle = middleware[i];
                  importMiddleware += `import ${middle} from '~/middleware/${middle}';`;
                }

                s.prepend(`
                  <script lang="ts">
                  ${importMiddleware}

                  export default {
                    beforeRouteEnter(to, from) {
                      return [${middleware}].reduce((acc, func) => {
                        if (acc === true) return func(to, from);
                        return acc;
                      }, true);
                    },
                  };
                  </script>
                `);
              }
            }
          },
        });
      } else {
        if (code.includes('</script>')) {
          s.replace('</script>', `import Layout from '~/layouts/Default.vue';</script>`);
        } else {
          s.prepend(`<script setup>import Layout from '~/layouts/Default.vue';</script>`);
        }

        s.replace(
          /<template>([\s\S]+)<\/template>/,
          `<template>\n<Layout>$1</Layout>\n</template>`,
        );
      }

      return getTransformResult(s, id);
    },
  };
}
