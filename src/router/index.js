// Composables
import { createRouter, createWebHashHistory } from 'vue-router';
import dashboardRoutes from './routes/dashboard';
import siteRoutes from './routes/site';

const routes = [...siteRoutes, ...dashboardRoutes];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
