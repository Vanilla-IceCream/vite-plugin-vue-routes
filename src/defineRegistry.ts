import path from 'path';
import { glob } from 'glob';
import { MagicString, getTransformResult, isCallOf, parseSFC, walkAST } from '@vue-macros/common';

import { hasTs } from './utils';

export default async (code: string, id: string) => {
  if (path.basename(id) !== 'Registry.vue') return;

  const hasMacro = code.includes('defineRegistry');

  const layouts = await glob(`src/layouts/*.vue`);
  const hasLayout = Boolean(layouts.length);

  const middlewareFiles = await glob(`src/middleware/*.{ts,js}`);
  const hasMiddleware = Boolean(middlewareFiles.length);

  if (!hasMacro && !hasLayout) return;

  const s = new MagicString(code);

  if (!hasMacro && hasLayout) {
    // injectLayout({ code, layout: 'Default', s });

    if (hasMiddleware) {
      if (middlewareFiles.some((file) => path.basename(file).includes('default'))) {
        injectMiddleware({ code, middleware: ['default'], s });
      }
    }
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
            s.overwriteNode(node, '', { offset });

            // injectLayout({ code, layout, s });

            if (hasMiddleware) {
              if (
                !!middlewareFiles.filter((file) =>
                  layout.toLowerCase().includes(path.parse(file).name.toLowerCase()),
                ).length
              ) {
                injectMiddleware({ code, middleware: [layout.toLowerCase()], s });
              }
            }
          }

          if (!hasLayoutVal && hasMiddlewareVal) {
            s.overwriteNode(node, '', { offset });

            // injectLayout({ code, layout: 'Default', s });
            injectMiddleware({ code, middleware: ['default', ...middleware], s });
          }

          if (hasLayoutVal && hasMiddlewareVal) {
            s.overwriteNode(node, '', { offset });

            // injectLayout({ code, layout, s });

            if (
              !!middlewareFiles.filter((file) =>
                layout.toLowerCase().includes(path.parse(file).name.toLowerCase()),
              ).length
            ) {
              injectMiddleware({ code, middleware: [layout.toLowerCase(), ...middleware], s });
            } else {
              injectMiddleware({ code, middleware, s });
            }
          }

          if (!hasLayoutVal && !hasMiddlewareVal) {
            s.overwriteNode(node, '', { offset });
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

// function injectLayout({ code, layout, s }: Omit<Injector, 'middleware'>) {
//   const _layout = layout.split('@');

//   if (code.includes('</script>')) {
//     s.replace(
//       /<\/script>/i,
//       _layout
//         .map(
//           (layoutName) =>
//             `import ${capitalize(layoutName)}Layout from '~/layouts/${capitalize(
//               layoutName,
//             )}.vue';`,
//         )
//         .join('') + '</script>',
//     );
//   } else {
//     s.prepend(
//       '<script setup>' +
//         _layout
//           .map(
//             (layoutName) =>
//               `import ${capitalize(layoutName)}Layout from '~/layouts/${capitalize(
//                 layoutName,
//               )}.vue';`,
//           )
//           .join('') +
//         '</script>',
//     );
//   }

//   s.replace(
//     /<template>([\s\S]+)<\/template>/,
//     '<template>' +
//       _layout.map((layoutName) => `<${capitalize(layoutName)}Layout>`).join('') +
//       '$1' +
//       _layout
//         .reverse()
//         .map((layoutName) => `</${capitalize(layoutName)}Layout>`)
//         .join('') +
//       '</template>',
//   );
// }

function injectMiddleware({ code, middleware, s }: Omit<Injector, 'layout'>) {
  const scriptLang = hasTs(code) ? `<script lang="ts">` : '<script>';

  let importMiddleware = '';

  for (let i = 0; i < middleware.length; i++) {
    const mod = middleware[i];
    importMiddleware += `import ${mod}Middleware from '~/middleware/${mod}';`;
  }

  s.prepend(`
    ${scriptLang}
    ${importMiddleware}

    export default {
      async beforeRouteEnter(to, from) {
        for (const func of [${middleware.map((m) => `${m}Middleware`)}]) {
          const result = await func(to, from);
          if (result !== true) return result;
        }

        return true;
      },
    };
    </script>
  `);
}
