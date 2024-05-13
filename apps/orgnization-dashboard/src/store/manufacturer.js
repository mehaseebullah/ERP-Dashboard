import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useManufacturerStore = defineStore({
  id: 'ManufacturerStore',
  state: () => ({
    manufacturers: [],
  }),
  actions: {
    async fetchManufacturers() {
      this.manufacturers=[];
      const { data } = await api.get('/Inventory/Manufacturers/GetAllManufacturers?PageSize=1000&PageNumber=0');
      this.manufacturers = data?.data?.data;
      return this.manufacturers;
    },
    async createManufacturer({ title, description }) {
      const { data } = await api.post('/Inventory/Manufacturers/Create', { title, description });
      this.fetchManufacturers();
      return data?.data;
    },
    async updateManufacturer({ id, title, description }) {
      const { data } = await api.put('/Inventory/Manufacturers/Update', { id, title, description });
      this.fetchManufacturers();
      return data?.data;
    },
    async deleteManufacturer({ id }) {
      const { data } = await api.delete(`/Inventory/Manufacturers/Delete?Id=${id}`);
      this.fetchManufacturers();
      return data?.data;
    },
  },
});
