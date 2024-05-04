import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useSupplierStore = defineStore({
  id: 'supplierStore',
  state: () => ({
    suppliers: [],
  }),
  actions: {
    async fetchSuppliers() {
      const { data } = await api.get('/supplier/list');
      this.suppliers = data?.data;
      return this.suppliers;
    },
    async createSupplier({ name, email, phone, address }) {
      const { data } = await api.post('/supplier/create', { name, email, phone, address });
      this.fetchSuppliers();
      return data?.data;
    },
    async updateSupplier({ id, name, email, phone, address }) {
      const { data } = await api.post('/supplier/update', { id, name, email, phone, address });
      this.fetchSuppliers();
      return data?.data;
    },
    async deleteSupplier({ id }) {
      const { data } = await api.post('/supplier/delete', { id });
      this.fetchSuppliers();
      return data?.data;
    },
  },
});
