import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useCustomerStore = defineStore({
  id: 'customerStore',
  state: () => ({
    customers: [],
  }),
  actions: {
    async fetchCustomers() {
      const { data } = await api.get('/customer/list');
      this.customers = data?.data;
      return this.customers;
    },
    async createCustomer({ name, email, phone, address }) {
      const { data } = await api.post('/customer/create', { name, email, phone, address });
      return data?.data;
    },
    async updateCustomer({ id, name, email, phone, address }) {
      const { data } = await api.post('/customer/update', { id, name, email, phone, address });
      return data?.data;
    },
    async deleteCustomer({ id }) {
      const { data } = await api.post('/customer/delete', { id });
      return data?.data;
    },
  },
});
