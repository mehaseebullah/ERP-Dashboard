import Layout from '../shared/layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/inventory',
    component: Layout,
    children: [
      {
        path: '/inventory/categories',
        component: () => import('./views/ProductCategoriesView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/products',
        component: () => import('./views/ProductView.vue'),
        meta: {
          title: 'Products',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/units',
        component: () => import('./views/ProductUnitsView.vue'),
        meta: {
          title: 'Product Categories',
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
