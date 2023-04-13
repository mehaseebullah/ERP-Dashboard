// Composables
import { createRouter, createWebHashHistory } from 'vue-router';
import appModules from './modules';

const router = createRouter({
  routes: [],
  history: createWebHashHistory(),
});

export function registerRouter(app) {
  // appModules.forEach((mod) => {
  for (let key in appModules) {
    const { routes } = appModules[key];
    routes?.forEach((route) => {
      router.addRoute(route);
    });
  }
  // });
  app.use(router);
}
