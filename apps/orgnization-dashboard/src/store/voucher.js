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
      const { data } = await api.get('/Finance/VoucherTypes/GetAllVoucherTypes');
      this.voucherTypes = data?.data;
    },
    async fetchVoucherList() {
      const { data } = await api.get('/Finance/Voucher/GetAllVoucher?PageSize=1000&PageNumber=0');
      this.vouchers = data?.data?.data;
    },
    async createVoucher({ voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO }) {
      const { data } = await api.post('/Finance/Voucher/AddUpdateVoucher', { voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO });
      this.fetchVoucherList();
      return data?.data?.data;
    },
    async updateVoucher({ id,voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO }) {
      const { data } = await api.post('/Finance/Voucher/AddUpdateVoucher', { id,voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO });
      this.fetchVoucherList();
      return data?.data?.data;
    },
    async deleteVoucher({ id }) {
      const { data } = await api.post(`/Finance/Voucher/GetVoucherById/${id}`);
      this.fetchVoucherList();
      return data?.data?.data;
    },
  },
});
