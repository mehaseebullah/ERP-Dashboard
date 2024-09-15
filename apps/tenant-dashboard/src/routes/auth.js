import AuthLayout from '@/layouts/AuthLayout.vue';

const routes = [
  {
    path: '/',
    component: () => import('../views/auth/LoginView.vue'),
    meta: {
      title: 'Login',
      layout: AuthLayout,
    },
  },
  {
    path: '/register',
    component: () => import('../views/auth/RegisterView.vue'),
    meta: {
      layout: AuthLayout,
      title: 'Register',
    },
  },
  {
    path: '/email/verify/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      layout: AuthLayout,
      title: 'Verification',
      type: 'emailOtp',
    },
  },
  {
    path: '/password/verify/otp/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      layout: AuthLayout,
      title: 'Verify OTP to reset password',
      type: 'resetPasswordOtp',
    },
  },
  {
    path: '/password/forget',
    component: () => import('../views/auth/ForgetPassword.vue'),
    meta: {
      layout: AuthLayout,
      title: 'ForgetPassword',
    },
  },
  {
    path: '/password/reset',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: {
      layout: AuthLayout,
      title: 'Reset Password',
    },
  },
];

export default routes;
