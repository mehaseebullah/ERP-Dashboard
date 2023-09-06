import Layout from '../layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/inventory',
    component: Layout,
    children: [
      {
        path: '/inventory/categories',
        component: () => import('../views/inventory/ProductCategoriesView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/products',
        component: () => import('../views/inventory/ProductView.vue'),
        meta: {
          title: 'Products',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/units',
        component: () => import('../views/inventory/ProductUnitsView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
