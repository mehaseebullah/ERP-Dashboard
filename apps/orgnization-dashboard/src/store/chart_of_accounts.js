import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useChartOfAccounts = defineStore({
  id: 'chartOfAccountsStore',
  state: () => ({
    accountTypes: [],
    accountGroups: [],
    accounts: [],
  }),
  actions: {
    async fetchAccountTypes() {
      const { data } = await api.get('/accounting/account/types');
      this.accountTypes = data?.data;
    },
    async fetchAllAccountGroups() {
      const { data } = await api.get('/Finance/AccountGroups/GetAllAccountGroups');
      this.accountGroups = data?.data?.data;
    },
    async fetchAllChartOfAccounts() {
      const { data } = await api.get('/Finance/ChartOfAccounts/GetAllChartOfAccounts?PageSize=10000&PageNumber=0');
      this.accounts = data?.data?.data;
    },
    async createAccount({ title, code, accountGroupId }) {
      const { data } = await api.post('/Finance/ChartOfAccounts/Create', { title, code, accountGroupId });
      this.fetchAccounts();
      return data?.data?.data;
    },
    async updateAccount({ id, title, code, accountGroupId }) {
      const { data } = await api.put('/Finance/ChartOfAccounts/Update', { id, title, code, accountGroupId  });
      this.fetchAccounts();
      return data?.data?.data;
    },
    async deleteAccount({ id }) {
      const { data } = await api.delete(`/Finance/ChartOfAccounts/Delete/${id}`);
      this.fetchAccounts();
      return data?.data?.data;
    },
  },
});
