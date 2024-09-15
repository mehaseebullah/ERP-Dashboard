import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useConfigStore = defineStore({
  id: 'configStore',
  state: () => ({
    showSidebar: true,
    isLoading: false,
    modules: [],
  }),
  getters: {
    getLoader() {
      return this.isLoading;
    },
  },

  actions: {
    async fetchModules() {
      const res = await api.get('/setting/bootstrap');
      this.modules = res.data;
    },
    setLoader(isLoading) {
      this.isLoading = isLoading;
    },
  },
});
