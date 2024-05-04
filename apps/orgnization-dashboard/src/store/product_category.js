import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useProductCategoryStore = defineStore({
  id: 'productCategoryStore',
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchProductCategories() {
      const { data } = await api.get('/catalog/category/list');
      this.categories = data?.data;
      return this.categories;
    },
    async createProductCategory({ title, description }) {
      const { data } = await api.post('/catalog/category/create', { title, description });
      this.fetchProductCategories();
      return data?.data;
    },
    async updateProductCategory({ id, title, description }) {
      const { data } = await api.post('/catalog/category/update', { id, title, description });
      this.fetchProductCategories();
      return data?.data;
    },
    async deleteProductCategory({ id }) {
      const { data } = await api.post('/catalog/category/delete', { id });
      this.fetchProductCategories();
      return data?.data;
    },
  },
});
