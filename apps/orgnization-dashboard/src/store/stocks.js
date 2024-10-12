import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useStocks = defineStore({
  id: 'stocksStore',
  state: () => ({
    stocks: []
  }),
  actions: {
    async fetchStocks() {
      const { data } = await api.get('/Inventory/Stocks/GetStocks?PageSize=10000&PageNumber=0');
      this.stocks = data?.data?.data;
    }
  },
});
