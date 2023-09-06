const routes = [
  {
    path: '/login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Customers',
      role: ['admin'],
    },
  },
];

export default routes;
