import { createRouter, createWebHistory } from 'vue-router';
// import dashboardRoutes from './dashboard';
import authRoutes from './auth';
// import workspace from './workspace';
import { useAuthStore } from '@/store/auth';

const routes = [...authRoutes];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.token && to.path == '/auth/login') {
    next({ path: '/' });
  }
  if (to.meta.auth == false) {
    next();
  } else {
    if (authStore.token) {
      next();
    } else {
      next({ path: '/auth/login' });
    }
  }
});

export default router;
