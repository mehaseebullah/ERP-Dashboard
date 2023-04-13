import Layout from '../shared/layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/customers',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('./views/CustomerView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
