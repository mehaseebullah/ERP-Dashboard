import { defineStore } from 'pinia';
import { http } from '@/helpers/http';
import { useSwal } from '@/composables/useSwal';
const swal=useSwal();
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
    async login({username,password,domain }) {
      const { data } = await http.post('/Tenant/Account/Login', { username,password,domain });
      console.log(data.data)
      if(!data.status)
      {
        swal.error(data.message);
        return;
      }
        
      localStorage.setItem('access_token', data?.data);
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
