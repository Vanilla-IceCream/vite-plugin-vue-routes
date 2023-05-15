import path from 'path';
import { glob } from 'glob';
import { MagicString, getTransformResult, isCallOf, parseSFC, walkAST } from '@vue-macros/common';

import { toTitleCase, hasTs } from './utils';

export default async (code: string, id: string) => {
  if (path.basename(id) !== 'Registry.vue') return;

  const hasMacro = code.includes('defineRegistry');

  const layouts = await glob(`src/layouts/*.vue`);
  const hasLayout = Boolean(layouts.length);

  if (!hasMacro && !hasLayout) return;

  const s = new MagicString(code);

  if (!hasMacro && hasLayout) {
    injectLayout({ code, layout: 'Default', s });
  }

  if (hasMacro) {
    const { scriptSetup, getSetupAst } = parseSFC(code, id);
    if (!scriptSetup) return;

    const setupAst = getSetupAst()!;
    const offset = scriptSetup.loc.start.offset;

    walkAST(setupAst, {
      enter(node) {
        if (isCallOf(node, 'defineRegistry')) {
          const match = code.match(/defineRegistry\(([\s\S]*?)\)/);

          const defineRegistryStr = match?.[1].trim();
          const defineRegistryObj = Function(`'use strict'; return (${defineRegistryStr})`)();
          const { layout, middleware } = JSON.parse(JSON.stringify(defineRegistryObj));

          const hasLayoutVal = typeof layout === 'string' && !!layout;
          const hasMiddlewareVal = !!middleware?.length;

          if (hasLayoutVal && !hasMiddlewareVal) {
            const mod = `import Layout from '~/layouts/${toTitleCase(layout)}.vue'`;
            s.overwriteNode(node, mod, { offset });

            injectLayout({ code, layout, s });
          }

          if (!hasLayoutVal && hasMiddlewareVal) {
            s.overwriteNode(node, '', { offset });

            injectLayout({ code, layout: 'Default', s });
            injectMiddleware({ code, middleware, s });
          }

          if (hasLayoutVal && hasMiddlewareVal) {
            const mod = `import Layout from '~/layouts/${toTitleCase(layout)}.vue'`;
            s.overwriteNode(node, mod, { offset });

            injectLayout({ code, layout, s });
            injectMiddleware({ code, middleware, s });
          }
        }
      },
    });
  }

  return getTransformResult(s, id);
};

interface Injector {
  code: string;
  layout: string;
  middleware: string[];
  s: MagicString;
}

function injectLayout({ code, layout, s }: Omit<Injector, 'middleware'>) {
  if (layout === 'Default') {
    if (code.includes('</script>')) {
      s.replace('</script>', `import Layout from '~/layouts/Default.vue';</script>`);
    } else {
      s.prepend(`<script setup>import Layout from '~/layouts/Default.vue';</script>`);
    }
  }

  s.replace(/<template>([\s\S]+)<\/template>/, `<template>\n<Layout>$1</Layout>\n</template>`);
}

function injectMiddleware({ code, middleware, s }: Omit<Injector, 'layout'>) {
  const scriptLang = hasTs(code) ? `<script lang="ts">` : '<script>';

  let importMiddleware = '';

  for (let i = 0; i < middleware.length; i++) {
    const mod = middleware[i];
    importMiddleware += `import ${mod} from '~/middleware/${mod}';`;
  }

  s.prepend(`
    ${scriptLang}
    ${importMiddleware}

    export default {
      async beforeRouteEnter(to, from) {
        for (const func of [${middleware}]) {
          const result = await func(to, from);
          if (result !== true) return result;
        }

        return true;
      },
    };
    </script>
  `);
}