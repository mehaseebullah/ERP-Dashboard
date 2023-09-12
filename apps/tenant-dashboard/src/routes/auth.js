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
  {
    path: '/verification',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      title: 'Verification',
    },
  },
  {
    path: '/forgetpassword',
    component: () => import('../views/auth/ForgetPassword.vue'),
    meta: {
      title: 'ForgetPassword',
    },
  },
  {
    path: '/resetpassword',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: {
      title: 'Reset Password',
    },
  },
];

export default routes;
