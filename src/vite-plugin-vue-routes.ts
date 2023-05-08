import type { Plugin } from 'vite';
import path from 'path';
import { glob } from 'glob';
import { MagicString, getTransformResult, isCallOf, parseSFC, walkAST } from '@vue-macros/common';

interface PluginOptions {
  dirs?: string;
}

async function createRoutes(options?: PluginOptions) {
  const dirs = options?.dirs || 'routes';

  const files = await glob(`src/${dirs}/**/Registry.vue`);

  const paths = [...files]
    .map((file) => {
      const match = file.match(new RegExp(`^src\\/${dirs}\\/(.*)\\/Registry\\.vue$`));

      if (match) {
        let path = '/' + match[1];

        // /(group) ->
        path = path.replace(/\/\(.+?\)/g, '');
        if (!path) path += '/';

        // /[...rest] -> /:rest*
        path = path.replace(/\[\.\.\.([^\]]+)\]/g, ':$1*');

        // /[[id]] -> /:id?
        path = path.replace(/\[\[(.+?)\]\]/g, ':$1?');

        // /[id] -> /:id
        path = path.replace(/\[(.+?)\]/g, ':$1');

        return path;
      }

      return null;
    })
    .filter(Boolean);

  const lines: string[] = [];

  files.forEach((item, index) => {
    const mod = `import('${item.replace('src', '~')}')`;
    lines.push(`{ path: '${paths[index]}', component: () => ${mod} },`);
  });

  return `
    export default () => {
      return [${lines.join('')}];
    };
  `;
}

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
        return createRoutes(options);
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
              const match = code.match(/defineRegistry\(([\s\S]*?)\);/);

              const defineRegistryStr = match?.[1].trim();
              const defineRegistryObj = Function(`'use strict'; return (${defineRegistryStr})`)();
              const defineRegistryOpt = JSON.parse(JSON.stringify(defineRegistryObj));

              if (defineRegistryOpt.layout?.toLocaleUpperCase() === 'DEFAULT') {
                s.overwriteNode(node, `import Layout from '~/layouts/Default.vue'`, { offset });
                s.replace(
                  /<template>([\s\S]+)<\/template>/,
                  `<template>\n<Layout>$1</Layout>\n</template>`,
                );
              } else {
                function toTitleCase(str: string) {
                  return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
                  });
                }

                const layoutFileName = toTitleCase(defineRegistryOpt.layout);

                s.overwriteNode(node, `import Layout from '~/layouts/${layoutFileName}.vue'`, {
                  offset,
                });
                s.replace(
                  /<template>([\s\S]+)<\/template>/,
                  `<template>\n<Layout>$1</Layout>\n</template>`,
                );
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
