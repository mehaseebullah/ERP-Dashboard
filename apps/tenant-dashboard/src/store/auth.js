import { defineStore } from 'pinia';

import { progHubHttpService, tenantAuthHttpService } from '@/helpers/http';

import { useSwal } from '@/composables/useSwal';

const swal = useSwal();

export const useAuthStore = defineStore({
  id: 'authStore',

  state: () => ({
    token: null,
    user: null,
  }),
  getters: {},
  actions: {
    async register({ username, email, password }) {
      try {
        const { data } = await progHubHttpService.post('/ProgHub/Account/Register', { username, email, password });
        console.log(data)
        if (data?.statusCode == 409) {

          swal.success(data?.message);

          // this.$router.push('/');
        } else {
          this.$router.push('/password/verify/otp');
        }
        // return data;
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },
    async login({ username, password }) {
      try {
        const { data } = await progHubHttpService.post('/ProgHub/Account/Login', { username, password });

        this.token = data?.data?.token;
        localStorage.setItem('access_token', this.token);

        swal.success('You are successfully logged in.');
        this.$router.push('/home');
      } catch (err) {
        console.log(err);
        if (err.response.data.statusCode === 403) {
          swal.error(err.response.data.message || 'Something went wrong');
          this.$router.push('/password/verify/otp');
        } else {
          swal.error(err.response.data.message || 'Something went wrong');
        }
      }
    },
    async getUserInfo() {
      try {
        const { data } = await progHubHttpService.get('/user/info');
        this.user = data;
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },

    async verifyOTP({ OtpCode, verificationType }) {
      try {
        const { data } = await progHubHttpService.get(
          `/ProgHub/OtpVerification/VerificationByOtpCodeAndType/${OtpCode}`,
        );
        if(data.statusCode==404)
        {
          swal.error(data.message);
          return;
        }
        swal.success('OTP verified successfully');
        if (verificationType === '6') {
          this.$router.push('/');
        }
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },

    async forgetPassword({ Email }) {
      try {
        const verificationType = '7';

        const { data } = await progHubHttpService.post('/ProgHub/OtpVerification/ResendOtpCode', {
          Email,
          verificationType,
        });
        this.token = data?.data;
        swal.success('Otp Successfully generated');
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },
    async resetPassword({ email, password }) {
      try {
        const { data } = await progHubHttpService.post('/ProgHub/Account/ResetPassword', { email, password });
        this.token = data?.data;
        swal.success('Password Updated Successfully');
        this.$router.push('/');
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('access_token', this.token);
      this.$router.push('/');
    },
  },
});
