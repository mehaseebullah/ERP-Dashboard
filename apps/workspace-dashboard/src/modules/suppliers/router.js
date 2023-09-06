import Layout from '../shared/layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/suppliers',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('./views/SupplierView.vue'),
        meta: {
          title: 'Suppliers',
          role: ['admin'],
        },
      },
    ],
  },
];

export default (router) => {
  routes?.forEach((route) => {
    router.addRoute(route);
  });
};
