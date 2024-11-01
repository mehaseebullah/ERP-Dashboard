import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useBalanceSheetStore = defineStore({
  id: 'balanceSheetStore',
  state: () => ({
    balanceSheets: [],
    ledgerDetails: [],
  }),
  actions: {
    async fetchBalanceSheets() {
      const { data } = await api.get('/Finance/Ledgers/GetBalanceSheet');
      this.balanceSheets = data?.data || [];
      return this.balanceSheets;
    },
    async fetchAccountTypeDetails(Code, item) {
      const { data } = await api.get(`/Finance/Ledgers/GetAccountTypeDetailsByCode?Code=${Code}`);
      item['accountTypeDetails'] = data?.data || [];
      return item;
    },
    async fetchAccountGroupDetails(Code, item) {
      const { data } = await api.get(`/Finance/Ledgers/GetAccountGroupDetailsByCode?Code=${Code}`);
      item['accountGroupDetails'] = data?.data || [];
      return item;
    },
    async fetchLedgerDetails(ChartsOfAccountId) {
      const { data } = await api.get(
        `/Finance/Ledgers/GetLedgerDetailsByChartsOfAccountId?ChartsOfAccountId=${ChartsOfAccountId}`,
      );
      this.ledgerDetails = data?.data || [];
      return this.ledgerDetails;
    },
  },
});
