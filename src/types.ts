export interface PluginOptions {
  /**
   * Directory of the routes.
   *
   * @default 'src/routes'
   */
  routesDir?: string;

  /**
   * Directory of the layouts.
   *
   * @default 'src/layouts'
   */
  layoutsDir?: string;

  /**
   * Directory of the middleware.
   *
   * @default 'src/middleware'
   */
  middlewareDir?: string;

  /**
   * File of the route definition.
   *
   * @default 'Registry.vue'
   */
  routeFile?: string;

  /**
   * Macro of the route definition for layouts and middleware.
   *
   * @default 'defineRegistry'
   */
  routeMacro?: string;
}
