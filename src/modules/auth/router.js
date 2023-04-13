import Layout from '../shared/layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/auth',
    component: Layout,
    children: [
      {
        path: '/auth/login',
        component: () => import('./views/LoginView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
