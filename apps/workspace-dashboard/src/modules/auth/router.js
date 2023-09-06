const routes = [
  {
    path: '/login',
    component: () => import('./views/LoginView.vue'),
    meta: {
      title: 'Customers',
      role: ['admin'],
    },
  },
];

export default (router) => {
  routes?.forEach((route) => {
    router.addRoute(route);
  });
};
