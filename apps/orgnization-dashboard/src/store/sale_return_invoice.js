import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useReturnSaleInvoiceStore = defineStore({
  id: 'saleReturnInvoiceStore',
  state: () => ({
    saleReturnInvoices: [],
  }),
  actions: {
    async fetchReturnSaleInvoiceList() {
      this.saleReturnInvoices=[];
      const { data } = await api.get('/Sale/ReturnSaleInvoice/GetAllReturnSaleInvoiceOrders?PageSize=100000&PageNumber=0');
      this.saleReturnInvoices = data?.data?.data;
      return this.saleReturnInvoices;
    },
    async createReturnSaleInvoice(d) {
      const { data } = await api.post('/Sale/ReturnSaleInvoice/Create', d);
      return data?.data?.data;
    },
    async updateReturnSale({ id, title, description }) {
      const { data } = await api.put('/Sale/ReturnSaleInvoice/Update', { id, title, description });
      return data?.data?.data;
    },
    async deleteReturnSale({ id }) {
      const { data } = await api.delete(`/Sale/ReturnSaleInvoice/Delete?Id=${id}`);
      this.fetchReturnSaleInvoiceList();
      return data?.data?.data;
    },
  },
});
