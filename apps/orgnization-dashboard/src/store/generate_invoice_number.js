import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useGenerateInoiceNumber = defineStore({
  id: 'generateInvoiceNumberStore',
  state: () => ({
  }),
  actions: {
    async fetchGenerateInvoiceNumber({Prefix}) {
      const { data } = await api.get(`/Tenant/GenerateInvoiceNumber/GenerateInvoiceNumber?Prefix=${Prefix}`);
      console.log('test111')
      return data;
    }
  },
});
