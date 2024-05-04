import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const usePurchaseInvoiceStore = defineStore({
  id: 'purchaseInvoiceStore',
  state: () => ({
    invoices: [],
  }),
  actions: {
    async fetchPurchaseInvoiceList() {
      const { data } = await api.get('/invoice/list');
      this.invoices = data?.data;
      return this.invoices;
    },
    async createPurchaseInvoice(d) {
      const { data } = await api.post('/invoice/create', d);
      this.fetchPurchaseInvoices();
      return data?.data;
    },
    async updatePurchaseInvoice({ id, title, description }) {
      const { data } = await api.post('/invoice/purchase/update', { id, title, description });
      this.fetchPurchaseInvoices();
      return data?.data;
    },
    async deletePurchaseInvoice({ id }) {
      const { data } = await api.post('/invoice/purchase/delete', { id });
      this.fetchPurchaseInvoices();
      return data?.data;
    },
  },
});
