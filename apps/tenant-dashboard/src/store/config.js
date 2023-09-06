import { defineStore } from 'pinia';

export const useConfigStore = defineStore({
  id: 'configStore',
  state: () => ({
    showSidebar: true,
    isLoading: false,
  }),
  getters: {
    getLoader() {
      return this.isLoading;
    },
  },

  actions: {
    setLoader(isLoading) {
      this.isLoading = isLoading;
    },
  },
});
