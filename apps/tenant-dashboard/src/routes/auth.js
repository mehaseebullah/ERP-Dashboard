const routes = [
  {
    path: '/login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      title: 'Register',
    },
  },
];

export default routes;
