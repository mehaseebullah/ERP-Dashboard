import Layout from '../layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/HomeView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
