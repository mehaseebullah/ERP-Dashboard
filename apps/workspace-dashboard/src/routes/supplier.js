import Layout from '../layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/suppliers',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('../views/supplier/SupplierView.vue'),
        meta: {
          title: 'Suppliers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
