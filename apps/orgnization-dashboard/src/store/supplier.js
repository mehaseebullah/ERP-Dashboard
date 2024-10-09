import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useSupplierStore = defineStore({
  id: 'supplierStore',
  state: () => ({
    suppliers: [],
  }),
  actions: {
    async fetchSuppliers() {
      this.suppliers=[];
      const { data } = await api.get('/Inventory/Suppliers/GetAllSuppliers?PageSize=10000&PageNumber=0');
      this.suppliers = data?.data?.data;
      return this.suppliers;
    },
    async createSupplier({ firstName, lastName, emailAddress, contactNumber,address }) {
      const { data } = await api.post('/Inventory/Suppliers/Create', { firstName, lastName, emailAddress, contactNumber,address});
      this.fetchSuppliers();
      return data?.data;
    },
    async updateSupplier({ id, firstName, lastName, emailAddress, contactNumber,address }) {
      const { data } = await api.put('/Inventory/Suppliers/Update', { id, firstName, lastName, emailAddress, contactNumber,address });
      this.fetchSuppliers();
      return data?.data;
    },
    async deleteSupplier({ id }) {
      const { data } = await api.delete(`/Inventory/Suppliers/Delete?Id=${id}`);
      this.fetchSuppliers();
      return data?.data;
    },
  },
});
