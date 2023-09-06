import Layout from '../layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/customers',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/customer/CustomerView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
