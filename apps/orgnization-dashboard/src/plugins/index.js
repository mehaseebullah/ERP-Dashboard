/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { markRaw } from 'vue';
import { loadFonts } from './webfontloader';
import vuetify from './vuetify';
import router from '../routes';
import pinia from '../store';
import swal from './swal';
import loader from './loader';
import { api } from '../helpers/http';

const comps = import.meta.glob('../views/**/*.vue');

export async function registerPlugins(app) {
  pinia.use(({ store }) => {
    store.$router = markRaw(router);
  });
  loadFonts();
  app.use(vuetify);
  app.use(pinia);

  if (localStorage.getItem('access_token')) {
    const response = await api.get('/setting/bootstrap');
    const modules = response?.data?.data;
    await Promise.all(
      modules.map(async (module) => {
        if (module.menu) {
          let route = {};
          if (module.menu.url) {
            route.path = `${module.menu.url}`;
          }
          route.name = `${module.menu.title}`;
          route.redirect = module.menu.redirect ?? undefined;
          if (module.menu.component) {
            route.component = comps[`../views/${module.menu.component}.vue`];
          }
          route.meta = module.menu?.meta ?? {
            requiresAuth: true,
            layout: 'DashboardLayout',
          };
          if (module?.menu?.children) {
            route.children = await Promise.all(
              module.menu.children.map(async (child) => {
                return {
                  path: `${child.url}`,
                  name: `${child.title}`,
                  component: comps[`../views/${child.component}.vue`],
                  meta: child.meta ?? {
                    requiresAuth: true,
                    layout: 'DashboardLayout',
                  },
                };
              }),
            );
          }
          router.addRoute(route);
        }
      }),
    );

    app.provide('modules', modules);
  }

  app.use(loader(pinia));

  app.use(swal);
  app.use(router);

  return app;
}
