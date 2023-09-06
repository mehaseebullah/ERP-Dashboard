import { createRouter, createWebHistory } from 'vue-router';
import dashboardRoutes from './dashboard';
import authRoutes from './auth';
import supplierRoutes from './supplier';
import customerRoutes from './customer';
import inventoryRoutes from './inventory';

const routes = [...dashboardRoutes, ...authRoutes, ...supplierRoutes, ...customerRoutes, ...inventoryRoutes];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
