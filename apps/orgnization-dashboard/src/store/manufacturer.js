import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useManufacturerStore = defineStore({
  id: 'ManufacturerStore',
  state: () => ({
    manufacturers: [],
  }),
  actions: {
    async fetchManufacturers() {
      this.Manufacturers=[];
      const { data } = await api.get('/Inventory/Manufacturers/GetAllProducts?PageSize=1000&PageNumber=0');
      this.Manufacturers = data?.data?.data;;
      return this.Manufacturers;
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
