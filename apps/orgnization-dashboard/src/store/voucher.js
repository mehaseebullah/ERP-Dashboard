import { defineStore } from 'pinia';
import { api, tempApi } from '@/helpers/http';

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
      return this.vouchers;
    },
    async fetchLedgersByVoucherId(VoucherId, item) {
      //console.log('vouc id', VoucherId, 'item is ', item);

      // const { data } = await api.get('/Finance/Ledgers/GetLedgersByVoucherId/VoucherId', { VoucherId });
      const { data } = await tempApi.get(`/Finance/Ledgers/GetLedgersByVoucherId/VoucherId?VoucherId=${VoucherId}`);

      item['ledgerDetailDTO'] = data?.data || [];
      return item;
    },
    async createVoucher({ voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO }) {
      const { data } = await api.post('/Finance/Voucher/AddUpdateVoucher', {
        voucherNo,
        voucherTypeId,
        voucherDate,
        description,
        ledgerDetailDTO,
      });
      this.fetchVoucherList();
      return data?.data?.data;
    },
    async updateVoucher({ id, voucherNo, voucherTypeId, voucherDate, description, ledgerDetailDTO }) {
      const { data } = await api.post('/Finance/Voucher/AddUpdateVoucher', {
        id,
        voucherNo,
        voucherTypeId,
        voucherDate,
        description,
        ledgerDetailDTO,
      });
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
