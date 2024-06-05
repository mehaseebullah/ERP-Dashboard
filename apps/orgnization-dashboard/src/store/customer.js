import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useCustomerStore = defineStore({
  id: 'customerStore',
  state: () => ({
    customers: [],
  }),
  actions: {
    async fetchCustomers() {
      this.customers=[];
      const { data } = await api.get('/Sale/Customers/GetAllCustomers?PageSize=10000&PageNumber=0');
      this.customers = data?.data?.data;
      return this.customers;
    },
    async createCustomer({ firstName, lastName, emailAddress, contactNumber,address }) {
      const { data } = await api.post('/Sale/Customers/Create', { firstName, lastName, emailAddress, contactNumber,address });
     this.fetchCustomers();
      return data?.data?.data;
    },
    async updateCustomer({ id, firstName, lastName, emailAddress, contactNumber,address }) {
      const { data } = await api.put('/Sale/Customers/Update', { firstName, lastName, emailAddress, contactNumber,address });
      this.fetchCustomers();
      return data?.data;
    },
    async deleteCustomer({ id }) {
      const { data } = await api.delete(`/Sale/Customers/Delete?Id=${id}`);
      this.fetchCustomers();
      return data?.data?.data;
    },
  },
});
