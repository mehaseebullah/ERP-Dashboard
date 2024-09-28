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
    async createProduct({ title, sku, description, categoryId, unitId, manufacturerId, salePrice, purchasePrice }) {
      let createProduct = new FormData();
      createProduct.append('title', title);
      createProduct.append('sku', sku);
      createProduct.append('description', description);
      createProduct.append('categoryId', categoryId);
      createProduct.append('unitId', unitId);
      createProduct.append('manufacturerId', manufacturerId);
      createProduct.append('salePrice', salePrice);
      createProduct.append('purchasePrice', purchasePrice);
      const { data } = await api.post('/Inventory/Products/Create', createProduct, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      this.fetchProducts();
      return data?.data;
    },
    async updateProduct({ id, title, sku, description, categoryId, unitId, manufacturerId, salePrice, purchasePrice }) {
      let updateProduct = new FormData();
      updateProduct.append('id', id);
      updateProduct.append('title', title);
      updateProduct.append('sku', sku);
      updateProduct.append('description', description);
      updateProduct.append('categoryId', categoryId);
      updateProduct.append('unitId', unitId);
      updateProduct.append('manufacturerId', manufacturerId);
      updateProduct.append('salePrice', salePrice);
      updateProduct.append('purchasePrice', purchasePrice);
      const { data } = await api.put('/Inventory/Products/Update', {
        id,
        title, sku, description, categoryId, unitId, manufacturerId, salePrice, purchasePrice
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
