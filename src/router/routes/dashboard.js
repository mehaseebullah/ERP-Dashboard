import Layout from '@/layouts/dashboard/DashboardLayout.vue';
import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    path: '/dashboard',
    component: Layout,
    name: 'DashboardLayout',
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: {
          title: 'Dashboard',
          role: ['admin'],
        },
      },
      {
        path: '/dashboard/customers',
        name: 'customers',
        component: import('@/views/Dashboard/Customers/CustomerView.vue'),
        meta: {
          title: 'Customers',
          role: ['admin'],
        },
      },
      {
        path: '/dashboard/suppliers',
        name: 'suppliers',
        component: import('@/views/Dashboard/Suppliers/SupplierView.vue'),
        meta: {
          title: 'Suppliers',
          role: ['admin'],
        },
      },
      {
        path: '/dashboard/product/categories',
        name: 'productCategories',
        component: import('@/views/Dashboard/Catalog/ProductCategoriesView.vue'),
        meta: {
          title: 'Product Categories',
          role: ['admin'],
        },
      },
    ],
  },
];

export default routes;
