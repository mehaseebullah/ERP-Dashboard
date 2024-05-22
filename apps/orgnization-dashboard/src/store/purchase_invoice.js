import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const usePurchaseInvoiceStore = defineStore({
  id: 'purchaseInvoiceStore',
  state: () => ({
    purchaseinvoices: [],
  }),
  actions: {
    async fetchPurchaseInvoiceList() {
      console.log('fetchPurchaseInvoiceList');
      this.purchaseinvoices=[];
      const { data } = await api.get('/Inventory/PurchaseInvoice/GetAllPurchaseInvoiceOrders?PageSize=1000&PageNumber=0');
      console.log(data)
      this.purchaseinvoices = data?.data?.data;
      return this.purchaseinvoices;
    },
    async createPurchaseInvoice(d) {
      const { data } = await api.post('/Inventory/PurchaseInvoice/Create', d);
      this.fetchPurchaseInvoices();
      return data?.data?.data;;
    },
    async updatePurchaseInvoice({ id, title, description }) {
      const { data } = await api.put('/Inventory/PurchaseInvoice/Update', { id, title, description });
      this.fetchPurchaseInvoices();
      return data?.data?.data;;
    },
    async deletePurchaseInvoice({ id }) {
      const { data } = await api.delete(`/Inventory/PurchaseInvoice/Delete?Id=${id}`);
      this.fetchPurchaseInvoices();
      return data?.data?.data;;
    },
  },
});
