import { defineStore } from 'pinia';
import { api } from '@/helpers/http';

export const useVoucherStore = defineStore({
  id: 'voucherStore',
  state: () => ({
    vouchers: [],
    voucherTypes: [],
  }),
  actions: {
    async fetchVoucherTypes() {
      const { data } = await api.get('/accounting/voucher/types');
      this.voucherTypes = data?.data;
    },
    async fetchVoucherList() {
      const { data } = await api.get('/accounting/voucher/list');
      this.vouchers = data?.data;
    },
    async createVoucher({ voucherDate, refNo, voucherType, description, details }) {
      const { data } = await api.post('/accounting/voucher/create', {
        voucherDate,
        refNo,
        voucherType,
        description,
        details,
      });
      this.fetchJvList();
      return data?.data;
    },
    async updateVoucher({ id, name, email, phone, address }) {
      const { data } = await api.post('/accounting/voucher/update', { id, name, email, phone, address });
      this.fetchJvList();
      return data?.data;
    },
    async deleteVoucher({ id }) {
      const { data } = await api.post('/accounting/voucher/delete', { id });
      this.fetchJvList();
      return data?.data;
    },
  },
});
