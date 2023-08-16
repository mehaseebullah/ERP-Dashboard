// Composables
import { createRouter, createWebHistory } from 'vue-router';
import appModules from './modules';

const router = createRouter({
  routes: [],
  history: createWebHistory(),
});

export function registerRouter(app) {
  // appModules.forEach((mod) => {
  for (let key in appModules) {
    const { initRoutes } = appModules[key];
    initRoutes(router);
  }
  // });
  app.use(router);
}
