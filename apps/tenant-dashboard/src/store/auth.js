import { defineStore } from 'pinia';

import http from '@/helpers/http';

import { useSwal } from '@/composables/useSwal';

const swal = useSwal();

export const useAuthStore = defineStore({
  id: 'authStore',
  // state: () => ({
  //   token: (() => localStorage.getItem('access_token'))(),
  //   user: null,
  // }),
  state: () => ({
    token: null,
    user: null,
  }),
  getters: {},
  actions: {
    async register({ username, email, password }) {
      try {
        const { data } = await http.post('/ProgHub/Account/Register', { username, email, password });
        if (data) {
          swal.success('Account created successfully');
          this.$router.push('/'); ////change
        }
        // return data;
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },
    async login({ username, password }) {
      try {
        const { data } = await http.post('/ProgHub/Account/Login', { username, password });

        // this.token = data?.data;
        // console.log(this.token.token);

        this.token = data?.data?.token;
        localStorage.setItem('access_token', this.token);
        console.log(this.token);

        // this.token = data?.data.token;
        // console.log(this.token);

        // console.log(data);

        swal.success('You are successfully login');
        this.$router.push('/home');
      } catch (err) {
        console.log(err);
        if (err.response.data.statusCode === 403) {
          swal.error('User Not Verified.First verify Otp');
          this.$router.push('/password/verify/otp');
        } else {
          swal.error(err.message || 'Something went wrong');
        }
        //  check 403

        //
      }
    },
    async getUserInfo() {
      try {
        const { data } = await http.get('/user/info');
        this.user = data;
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },
    // new addition
    async verifyOTP({ OtpCode, verificationType }) {
      try {
        const { data } = await http.get(`/ProgHub/OtpVerification/VerificationByOtpCodeAndType/${OtpCode}`);
        this.token = data?.data;
        console.log(this.token);

        swal.success('OTP verified successfully');
        this.$router.push('/');
      } catch (err) {
        console.log({ OtpCode });

        swal.error(err.message || 'Something went wrong');
      }
    },

    async forgetPassword({ Email }) {
      try {
        const verificationType = '7';
        console.log(Email);

        const { data } = await http.post('/ProgHub/OtpVerification/ResendOtpCode', { Email, verificationType });
        this.token = data?.data;
        swal.success('Otp Successfully generated');
        //this.$router.push('/password/reset');
      } catch (err) {
        console.log({ Email });
        swal.error('User Not found.Try again n');
        swal.error(err.message || 'Something went wrong');
      }
    },
    async resetPassword({ email, password }) {
      try {
        console.log('In async resetpassword try');

        console.log(email, password);
        const { data } = await http.post('/ProgHub/Account/ResetPassword', { email, password });
        this.token = data?.data;
        swal.success('Password Updated Successfully');
        this.$router.push('/');
      } catch (err) {
        console.log('In async resetpassword catch');
        console.log({ email, password });
        swal.error('Reset Password Failed.Try Again');
        swal.error(err.message || 'Something went wrong');
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.$router.push('/login');
    },
  },
});
