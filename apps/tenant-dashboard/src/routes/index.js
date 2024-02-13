import { createRouter, createWebHistory } from 'vue-router';
import dashboardRoutes from './dashboard';
import authRoutes from './auth';
import workspace from './workspace';

const routes = [...dashboardRoutes, ...authRoutes, ...workspace];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
