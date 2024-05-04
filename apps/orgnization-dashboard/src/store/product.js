import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useProductStore = defineStore({
  id: 'productStore',
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchProducts() {
      const { data } = await api.get('/catalog/product/list');
      this.products = data?.data;
      return this.products;
    },
    async createProduct({ title, sku, description, categoryId, unit, salePrice, purchasePrice }) {
      const { data } = await api.post('/catalog/product/create', {
        title,
        sku,
        description,
        categoryId,
        unit,
        salePrice,
        purchasePrice,
      });
      this.fetchProducts();
      return data?.data;
    },
    async updateProduct({ id, title, sku, description, categoryId, unit, salePrice, purchasePrice }) {
      const { data } = await api.post('/catalog/product/update', {
        id,
        title,
        sku,
        description,
        categoryId,
        unit,
        salePrice,
        purchasePrice,
      });
      this.fetchProducts();
      return data?.data;
    },
    async deleteProduct({ id }) {
      const { data } = await api.post('/catalog/product/delete', { id });
      this.fetchProducts();
      return data?.data;
    },
  },
});
