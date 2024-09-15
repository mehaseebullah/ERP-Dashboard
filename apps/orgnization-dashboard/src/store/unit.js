import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useUnitStore = defineStore({
  id: 'unitStore',
  state: () => ({
    units: [],
  }),
  actions: {
    async fetchUnits() {
      const { data } = await api.get('/catalog/unit/list');
      this.units = data?.data;
      return this.units;
    },
    async createUnit({ title, description }) {
      const { data } = await api.post('/catalog/unit/create', { title, description });
      this.fetchUnits();
      return data?.data;
    },
    async updateUnit({ id, title, description }) {
      const { data } = await api.post('/catalog/unit/update', { id, title, description });
      this.fetchUnits();
      return data?.data;
    },
    async deleteUnit({ id }) {
      const { data } = await api.post('/catalog/unit/delete', { id });
      this.fetchUnits();
      return data?.data;
    },
  },
});
