import DashboardLayout from '@/layouts/DashboardLayout.vue';

const routes = [
  {
    path: '/home',
    component: () => import('../views/HomeView.vue'),
    meta: {
      title: 'Customers',
      role: ['admin'],
      layout: DashboardLayout,
    },
  },
];

export default routes;
