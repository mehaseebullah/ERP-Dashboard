import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useProductStore = defineStore({
  id: 'productStore',
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchProducts() {
      const { data } = await api.get('/Inventory/Products/GetAllProducts?PageSize=1000&PageNumber=0');
      this.products = data?.data?.data;
      return this.products;
    },
    async createProduct({ title, sku, description, categoryId, unitId, manufacturerId,salePrice, purchasePrice }) {
      const { data } = await api.post('/Inventory/Products/Create', {
        title, sku, description, categoryId, unitId, manufacturerId,salePrice, purchasePrice
      });
      this.fetchProducts();
      return data?.data;
    },
    async updateProduct({ id, title, sku, description, categoryId, unitId, manufacturerId,salePrice, purchasePrice }) {
      const { data } = await api.put('/Inventory/Products/Update', {
        id,
        title, sku, description, categoryId, unitId, manufacturerId,salePrice, purchasePrice
      });
      this.fetchProducts();
      return data?.data;
    },
    async deleteProduct({ id }) {
      const { data } = await api.delete(`/Inventory/Products/Delete?Id=${id}`);
      this.fetchProducts();
      return data?.data;
    },
  },
});
