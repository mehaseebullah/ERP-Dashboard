import { createRouter, createWebHashHistory } from 'vue-router';
import dashboardRoutes from './routes/dashboard';
import siteRoutes from './routes/site';
import useStores from '@/stores';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...siteRoutes, ...dashboardRoutes],
});

router.beforeEach(async (to, from, next) => {
  const { authStore } = useStores();
  const whiteList = ['/', '/register'];
  document.title = to.meta.title || 'Dashboard';

  if (authStore.token) {
    if (to.path === '/') {
      next({ path: '/dashboard' });
    } else {
      if (authStore?.user?.groups?.some((g) => to?.meta?.role?.includes(g.title))) {
        next();
      } else {
        try {
          await authStore.getUserInfo();
          if (authStore?.user) {
            next({ ...to, replace: true });
          } else {
            authStore.logout();
            next(`/`);
          }
        } catch (e) {
          authStore.logout();
          next(`/`);
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next(`/?redirect=${to.path}`);
    }
  }
});

router.afterEach(() => {
  // const store = useMainStore();
  // store.mainBar.stop();
});

export default router;
