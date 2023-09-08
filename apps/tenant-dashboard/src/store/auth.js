import { defineStore } from 'pinia';
import http from '@/helpers/http';
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
        const { data } = await http.post('/ProgHub/Account/Register', { username, email, password });
        if (data) {
          swal.success('Account created successfully');
          this.$router.push('/login');
        }
        // return data;
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
      }
    },
    async login({ username, password }) {
      try {
        const { data } = await http.post('/ProgHub/Account/Login', { username, password });
        this.token = data?.data;
        swal.success('You are successfully login');
        this.$router.push('/home');
      } catch (err) {
        swal.error(err.message || 'Something went wrong');
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
    logout() {
      this.token = null;
      this.user = null;
      this.$router.push('/login');
    },
  },
});
