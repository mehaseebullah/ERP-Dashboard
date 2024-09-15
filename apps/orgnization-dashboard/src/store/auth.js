import { defineStore } from 'pinia';
import { http } from '@/helpers/http';

export const useAuthStore = defineStore({
  id: 'authStore',
  state: () => ({
    token: (() => localStorage.getItem('access_token'))(),
    user: null,
  }),
  getters: {},
  actions: {
    async register({ username, email, password }) {
      const { data } = await http.post('/ProgHub/Account/Register', { username, email, password });
      if (data) {
        this.$router.push('/login');
      }
    },
    async login({ email, password }) {
      const { data } = await http.post('/auth/Login', { email, password });
      localStorage.setItem('access_token', data?.token);
      window.location.reload();
    },
    async fetchUserInfo() {
      const { data } = await http.get('/user/info');
      this.user = data;
    },
    logout() {
      this.token = null;
      this.user = null;
      this.$router.push('/login');
    },
  },
});
