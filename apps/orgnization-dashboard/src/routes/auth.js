const routes = [
  {
    path: '/auth/login',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      layout: 'AuthLayout',
      auth: false,
    },
  },
  {
    path: '/auth/register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      layout: 'AuthLayout',
      title: 'Register',
      auth: false,
    },
  },
  {
    path: '/auth/email/verify/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      layout: 'AuthLayout',
      title: 'Verification',
      type: 'emailOtp',
      auth: false,
    },
  },
  {
    path: '/auth/password/verify/otp/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      layout: 'AuthLayout',
      title: 'Verify OTP to reset password',
      type: 'resetPasswordOtp',
      auth: false,
    },
  },
  {
    path: '/auth/password/forget',
    component: () => import('../views/auth/ForgetPassword.vue'),
    meta: {
      layout: 'AuthLayout',
      title: 'ForgetPassword',
      auth: false,
    },
  },
  {
    path: '/auth/password/reset',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: {
      layout: 'AuthLayout',
      title: 'Reset Password',
      auth: false,
    },
  },
];

export default routes;
