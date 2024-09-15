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
    async fetchAccountGroups() {
      const { data } = await api.get('/accounting/account/groups');
      this.accountGroups = data?.data;
    },
    async fetchAccounts() {
      const { data } = await api.get('/accounting/account/list');
      this.accounts = data?.data;
    },
    async createAccount({ name, email, phone, address }) {
      const { data } = await api.post('/accounting/account/create', { name, email, phone, address });
      this.fetchAccounts();
      return data?.data;
    },
    async updateAccount({ id, name, email, phone, address }) {
      const { data } = await api.post('/accounting/account/update', { id, name, email, phone, address });
      this.fetchAccounts();
      return data?.data;
    },
    async deleteAccount({ id }) {
      const { data } = await api.post('/accounting/account/delete', { id });
      this.fetchAccounts();
      return data?.data;
    },
  },
});
