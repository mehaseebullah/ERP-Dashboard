import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useInvoiceStore = defineStore({
  id: 'invoiceStore',
  state: () => ({
    invoices: [],
  }),
  getters: {
    getPurchaseInvoices: (state) => state.invoices.filter((i) => i.invoiceType === 'purchase'),
    getSaleInvoices: (state) => state.invoices.filter((i) => i.invoiceType === 'sale'),
  },
  actions: {
    async fetchInvoiceList() {
      const { data } = await api.get('/invoice/list');
      this.invoices = data?.data;
      return this.invoices;
    },
    async createInvoice(d) {
      const { data } = await api.post('/invoice/create', d);
      this.fetchInvoices();
      return data?.data;
    },
    async updateInvoice({ id, title, description }) {
      const { data } = await api.post('/invoice/update', { id, title, description });
      this.fetchInvoices();
      return data?.data;
    },
    async deleteInvoice({ id }) {
      const { data } = await api.post('/invoice/delete', { id });
      this.fetchInvoices();
      return data?.data;
    },
  },
});
