import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useSaleInvoiceStore = defineStore({
  id: 'invoiceStore',
  state: () => ({
    saleInvoices: [],
  }),
  actions: {
    async fetchInvoiceList() {
      this.saleInvoices=[];
      const { data } = await api.get('/Sale/SaleInvoice/GetAllSaleInvoiceOrders?PageSize=1000&PageNumber=0');
      this.saleInvoices = data?.data?.data;
      return this.saleInvoices;
    },
    async createInvoice(d) {
      const { data } = await api.post('/Sale/SaleInvoice/Create', d);
      this.fetchInvoices();
      return data?.data?.data;
    },
    async updateInvoice({ id, title, description }) {
      const { data } = await api.put('/Sale/SaleInvoice/Update', { id, title, description });
      this.fetchInvoices();
      return data?.data?.data;
    },
    async deleteInvoice({ id }) {
      const { data } = await api.delete(`/Sale/SaleInvoice/Delete?Id=${id}`);
      this.fetchInvoices();
      return data?.data?.data;
    },
  },
});
