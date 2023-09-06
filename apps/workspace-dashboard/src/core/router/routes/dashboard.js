import Layout from '@/layouts/dashboard/DashboardLayout.vue';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    name: 'DashboardLayout',
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Dashboard',
          role: ['admin'],
        },
      },
      {
        path: '/customers',
        name: 'customers',
        component: import('@/views/Dashboard/Customers/CustomerView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
      {
        path: '/suppliers',
        name: 'suppliers',
        component: import('@/views/Dashboard/Suppliers/SupplierView.vue'),
        meta: {
          title: 'Suppliers',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/categories',
        name: 'productCategories',
        component: import('@/views/Dashboard/Inventory/ProductCategoriesView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
      {
        path: '/inventory/units',
        name: 'productUnits',
        component: import('@/views/Dashboard/Inventory/ProductUnitsView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
