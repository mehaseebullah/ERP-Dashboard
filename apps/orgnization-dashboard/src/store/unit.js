import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useUnitStore = defineStore({
  id: 'unitStore',
  state: () => ({
    units: [],
  }),
  actions: {
    async fetchUnits() {
      this.units = [];
      const { data } = await api.get('/Inventory/Units/GetAllUnits');
      this.units = data?.data;
      return this.units;
    },
    async fetchPaginatedUnits() {
      this.units = [];
      const { data } = await api.get('/Inventory/Units/GetPaginatedUnits?PageSize=10000&PageNumber=0');
      this.units = data?.data?.data;
      return this.units;
    },
    async createUnit({ title, description }) {
      const { data } = await api.post('/Inventory/Units/Create', { title, description });
      this.fetchPaginatedUnits();
      return data?.data;
    },
    async updateUnit({ id, title, description }) {
      const { data } = await api.put('/Inventory/Units/Update', { id, title, description });
      this.fetchPaginatedUnits();
      return data?.data;
    },
    async deleteUnit({ id }) {
      const { data } = await api.delete(`/Inventory/Units/Delete?Id=${id}`);
      this.fetchPaginatedUnits();
      return data?.data;
    },
  },
});
