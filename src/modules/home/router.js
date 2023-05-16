import Layout from '../shared/layouts/dashboard/DashboardLayout.vue';

const routes = [
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('./views/HomeView.vue'),
        meta: {
          title: 'Customers',
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
