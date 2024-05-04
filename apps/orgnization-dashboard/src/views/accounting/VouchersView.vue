<script setup>
import { onMounted, ref } from 'vue';
import { useVoucherStore } from '@/store/voucher';
import { useChartOfAccounts } from '@/store/chart_of_accounts';
import { useSwal } from '@/composables/useSwal';
import { storeToRefs } from 'pinia';
import { parseTitle } from '@/helpers/utils';

const coaStore = useChartOfAccounts();
const { accounts } = storeToRefs(coaStore);
const voucherStore = useVoucherStore();
const { vouchers, voucherTypes } = storeToRefs(voucherStore);
const swal = useSwal();

const headers = [
  {
    title: 'Title',
    key: 'title',
  },
  {
    title: 'Code',
    key: 'code',
  },
  {
    title: 'Type',
    key: 'type',
  },
  {
    title: 'Category',
    key: 'category',
  },
  {
    title: 'Actions',
    key: 'actions',
  },
];
const formModal = {
  voucherDate: '',
  refNo: '',
  voucherType: '',
  description: '',
  details: [
    {
      accountId: '',
      debit: 0,
      credit: 0,
    },
  ],
};

const formData = ref({ ...formModal });
const isEdit = ref(false);
const showDrawer = ref(false);

async function newVoucher() {
  formData.value = { ...formModal };
  isEdit.value = false;
  showDrawer.value = true;
}

async function createVoucher() {
  await voucherStore.createVoucher(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
}

async function editVoucher(item) {
  formData.value = { ...item };
  isEdit.value = true;
  showDrawer.value = true;
}

async function updateVoucher() {
  await voucherStore.updateVoucher(formData.value);
  showDrawer.value = false;
  formData.value = { ...formModal };
  isEdit.value = false;
}

async function deleteVoucher(id) {
  swal.confirm('Are you sure you want to delete this entry?').then(async (result) => {
    if (result.isConfirmed) {
      await voucherStore.deleteVoucher({ id });
      showDrawer.value = false;
    }
  });
}

onMounted(async () => {
  voucherStore.fetchVoucherList();
  voucherStore.fetchVoucherTypes();
  coaStore.fetchAccounts();
});
</script>
<template>
  <v-container>
    <v-card>
      <v-toolbar color="secondary" density="compact">
        <v-spacer></v-spacer>
        <v-btn @click="newVoucher()">Create Voucher</v-btn>
      </v-toolbar>
      <v-data-table :loading="$loading('fetchVoucherList')" :headers="headers" :items="vouchers">
        <template v-slot:item.actions="{ item }">
          <v-btn size="small" variant="text" :disabled="item.is_system" @click="editVoucher(item)" icon="mdi-pencil">
          </v-btn>
          <v-btn
            size="small"
            variant="text"
            :disabled="item.is_system"
            @click="deleteVoucher(item.id)"
            icon="mdi-delete"
          >
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <main-drawer v-model="showDrawer" width="800" title="CREATE VOUCHER" :toolbar="{ color: 'primary' }">
      <v-form class="pa-5" @submit.prevent="isEdit ? updateVoucher() : createVoucher()">
        <v-text-field v-model="formData.voucherDate" label="Date" type="date" variant="outlined"></v-text-field>
        <v-text-field v-model="formData.refNo" label="Voucher No" variant="outlined"></v-text-field>
        <v-select
          :items="Object.values(voucherTypes).map(parseTitle) || []"
          item-title="title"
          item-value="id"
          v-model="formData.voucherType"
          :loading="$loading('fetchVoucherTypes')"
          label="Type"
          variant="outlined"
        >
        </v-select>
        <v-textarea v-model="formData.description" label="Description" variant="outlined" rows="2"></v-textarea>
        <template v-for="(entry, index) in formData.details" :key="index">
          <v-row>
            <v-col>
              <v-select
                :items="accounts"
                item-title="title"
                item-value="id"
                v-model="entry.accountId"
                :loading="$loading('fetchAccounts')"
                label="Account"
                variant="outlined"
                density="compact"
              ></v-select>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.debit"
                label="Debit"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                type="number"
                density="compact"
                v-model.number="entry.credit"
                label="Credit"
                variant="outlined"
              ></v-text-field>
            </v-col>
            <v-col v-if="index > 0" cols="1">
              <v-btn variant="text" size="small" icon="mdi-delete" @click="formData.details.splice(index, 1)"></v-btn>
            </v-col>
          </v-row>
        </template>
        <div class="d-flex justify-end mb-5">
          <v-btn variant="text" @click="formData.details.push({ accountId: '', debit: 0, credit: 0 })">Add Entry</v-btn>
        </div>
        <div class="d-flex justify-end">
          <v-btn v-if="isEdit" :loading="$loading('updateVoucher')" type="submit" color="primary">Update</v-btn>
          <v-btn v-else :loading="$loading('createVoucher')" type="submit" color="primary">Create</v-btn>
        </div>
      </v-form>
    </main-drawer>
  </v-container>
</template>
