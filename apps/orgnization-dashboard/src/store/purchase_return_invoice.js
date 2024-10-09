import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const usePurchaseReturnInvoiceStore = defineStore({
  id: 'purchaseReturnInvoiceStore',
  state: () => ({
    purchaseReturnInvoices: [],
  }),
  actions: {
    async fetchPurchaseReturnInvoiceList() {
      this.purchaseReturnInvoices=[];
      const { data } = await api.get('/Inventory/ReturnPurchaseInvoice/GetReturnAllPurchaseOrders?PageSize=1000&PageNumber=0');
      this.purchaseReturnInvoices = data?.data?.data;
      return this.purchaseReturnInvoices;
    },
    async createPurchaseReturnInvoice(d) {
      const { data } = await api.post('/Inventory/ReturnPurchaseInvoice/Create', d);
      return data?.data?.data;;
    },
    async updatePurchaseReturnInvoice({ id, title, description }) {
      const { data } = await api.put('/Inventory/ReturnPurchaseInvoice/Update', { id, title, description });
      this.fetchPurchaseReturnInvoiceList();
      return data?.data?.data;;
    },
    async deletePurchaseReturnInvoice({ id }) {
      const { data } = await api.delete(`/Inventory/ReturnPurchaseInvoice/Delete?Id=${id}`);
      this.fetchPurchaseReturnInvoiceList();
      return data?.data?.data;;
    },
  },
});
