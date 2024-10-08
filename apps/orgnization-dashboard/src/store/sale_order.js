import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useSaleOrderStore = defineStore({
  id: 'salOrderStore',
  state: () => ({
    saleOrders: [],
  }),
  actions: {
    async fetchSaleOrderList() {
      this.saleOrders=[];
      const { data } = await api.get('/Sale/SaleOrder/GetAllSaleOrders?PageSize=100000&PageNumber=0');
      this.saleOrders = data?.data?.data;
      return this.saleOrders;
    },
    async fetchSaleOrderBySONumber(soNumber) {
      const { data } = await api.get(`/Sale/SaleOrder/GetSaleOrderWithDetailsBySONumber/${soNumber}`);
      return data;
    },
    async createSaleOrder(d) {
      const { data } = await api.post('/Sale/SaleOrder/Create', d);
      this.fetchSaleInvoiceList();
      return data?.data?.data;
    },
    async updateSaleOrder({ id, title, description }) {
      const { data } = await api.put('/Sale/SaleOrder/Update', { id, title, description });
      this.fetchSaleInvoiceList();
      return data?.data?.data;
    },
    async deleteSaleOrder({ id }) {
      const { data } = await api.delete(`/Sale/SaleOrder/Delete?Id=${id}`);
      this.fetchSaleInvoiceList();
      return data?.data?.data;
    },
  },
});
