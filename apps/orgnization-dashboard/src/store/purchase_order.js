import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const usePurchaseOrderStore = defineStore({
  id: 'purchaseOrderStore',
  state: () => ({
    purchaseOrders: [],
  }),
  actions: {
    async fetchPurchaseOrderList() {
      this.purchaseOrders = [];
      const { data } = await api.get('/Inventory/PurchaseOrder/GetAllPurchaseOrders?PageSize=1000&PageNumber=0');
      this.purchaseOrders = data?.data?.data;
      return this.purchaseOrders;
    },
    async fetchPurchaseOrderListDetails(PurchaseOrderId, item) {
      const { data } = await api.get(`/Inventory/PurchaseOrder/GetPurchaseOrderDetailsByPOId/${PurchaseOrderId}`);
      item['poDetails'] = data?.data || [];
      return item;
    },
    async fetchPurchaseOrderByPONumber(poNumber) {
      const { data } = await api.get(`/Inventory/PurchaseOrder/GetPurchaseOrderWithDetailsByPONumber/${poNumber}`);
      return data;
    },
    async createPurchaseOrder(d) {
      const { data } = await api.post('/Inventory/PurchaseOrder/Create', d);
      return data?.data?.data;
    },
    async updatePurchaseOrder({ id, title, description }) {
      const { data } = await api.put('/Inventory/PurchaseOrder/Update', { id, title, description });
      this.fetchPurchaseOrderList();
      return data?.data?.data;
    },
    async deletePurchaseOrdre({ id }) {
      const { data } = await api.delete(`/Inventory/PurchaseOrder/Delete?Id=${id}`);
      this.fetchPurchaseOrderList();
      return data?.data?.data;
    },
  },
});
