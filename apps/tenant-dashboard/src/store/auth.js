import { defineStore } from 'pinia';
import http from '@/helpers/http';
import { useSwal } from '@/composables/useSwal';

function handleError(err) {
  const swal = useSwal();
  swal.error(err.message || 'Something went wrong');
}

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
        return data;
      } catch (err) {
        handleError(err);
      }
    },
    async login({ username, password }) {
      try {
        const { data } = await http.post('/login', { username, password });
        this.token = data?.token;
        this.$router.push('/dashboard');
      } catch (err) {
        handleError(err);
      }
    },
    async getUserInfo() {
      try {
        const { data } = await http.get('/user/info');
        this.user = data;
      } catch (err) {
        handleError(err);
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.$router.push('/login');
    },
  },
});
