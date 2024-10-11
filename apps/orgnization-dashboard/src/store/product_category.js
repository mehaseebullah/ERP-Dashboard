import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useProductCategoryStore = defineStore({
  id: 'productCategoryStore',
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchProductCategories() {
      this.categories=[];
      const { data } = await api.get('/Inventory/Categories/GetAllCategories');
      this.categories = data?.data;
      return this.categories;
    },
    async fetchPaginatedProductCategories() {
      this.categories=[];
      const { data } = await api.get('/Inventory/Categories/GetPaginatedCategories?PageSize=1000&PageNumber=0');
      this.categories = data?.data?.data;;
      return this.categories;
    },
    
    async createProductCategory({ title, description }) {
      const { data } = await api.post('/Inventory/Categories/Create', { title, description });
      this.fetchProductCategories();
      return data?.data;
    },
    async updateProductCategory({ id, title, description }) {
      const { data } = await api.put('/Inventory/Categories/Update', { id, title, description });
      this.fetchProductCategories();
      return data?.data;
    },
    async deleteProductCategory({ id }) {
      const { data } = await api.delete(`/Inventory/Categories/Delete?Id=${id}`);
      this.fetchProductCategories();
      return data?.data;
    },
  },
});
