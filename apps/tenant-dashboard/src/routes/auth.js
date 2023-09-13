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
    path: '/verify/email/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      title: 'Verification',
      type: 'emailOtp',
    },
  },
  {
    path: '/reset/password/otp/:userId',
    component: () => import('../views/auth/OtpVerification.vue'),
    meta: {
      title: 'Verify OTP to reset password',
      type: 'resetPasswordOtp',
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
    path: '/reset/password',
    component: () => import('../views/auth/ResetPassword.vue'),
    meta: {
      title: 'Reset Password',
    },
  },
];

export default routes;
